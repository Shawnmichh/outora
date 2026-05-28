/**
 * Currency formatting utilities for localized budget displays.
 *
 * Provides functions to format budget options and ranges based on detected currency.
 * Integrates with backend currency detection from geolocation.
 */

/**
 * Budget ranges for different currencies.
 * Maps currency code to [min, max] values for each budget tier.
 *
 * Based on realistic purchasing power and local cost of living in each region.
 * These are NOT exchange rate conversions - they reflect actual local spending patterns.
 *
 * Budget tiers represent typical per-person spending for a day outing:
 * - Budget: Basic meals, public transport, free/low-cost activities
 * - Moderate: Mid-range dining, mix of transport, paid attractions
 * - Premium: Nice restaurants, convenient transport, premium experiences
 * - Luxury: Fine dining, private transport, exclusive activities
 */
export const CURRENCY_BUDGET_RANGES = {
  // United States Dollar
  USD: {
    budget: [0, 30],
    moderate: [30, 75],
    premium: [75, 150],
    luxury: [150, null],
  },
  // Euro (Western Europe average)
  EUR: {
    budget: [0, 30],
    moderate: [30, 75],
    premium: [75, 150],
    luxury: [150, null],
  },
  // British Pound
  GBP: {
    budget: [0, 25],
    moderate: [25, 60],
    premium: [60, 120],
    luxury: [120, null],
  },
  // Indian Rupee (realistic local purchasing power)
  INR: {
    budget: [500, 1500],
    moderate: [1500, 4000],
    premium: [4000, 10000],
    luxury: [10000, null],
  },
  // Japanese Yen (realistic Tokyo/major city pricing)
  JPY: {
    budget: [1000, 4000],
    moderate: [4000, 10000],
    premium: [10000, 20000],
    luxury: [20000, null],
  },
  // Chinese Yuan (major city pricing)
  CNY: {
    budget: [50, 200],
    moderate: [200, 500],
    premium: [500, 1200],
    luxury: [1200, null],
  },
  // Thai Baht (Bangkok/tourist area pricing)
  THB: {
    budget: [300, 1000],
    moderate: [1000, 2500],
    premium: [2500, 6000],
    luxury: [6000, null],
  },
  // Singapore Dollar (high cost of living)
  SGD: {
    budget: [20, 50],
    moderate: [50, 120],
    premium: [120, 250],
    luxury: [250, null],
  },
  // Australian Dollar
  AUD: {
    budget: [30, 60],
    moderate: [60, 130],
    premium: [130, 250],
    luxury: [250, null],
  },
  // Canadian Dollar
  CAD: {
    budget: [25, 50],
    moderate: [50, 110],
    premium: [110, 220],
    luxury: [220, null],
  },
  // Brazilian Real
  BRL: {
    budget: [50, 150],
    moderate: [150, 400],
    premium: [400, 900],
    luxury: [900, null],
  },
  // South African Rand
  ZAR: {
    budget: [200, 600],
    moderate: [600, 1500],
    premium: [1500, 3500],
    luxury: [3500, null],
  },
  // Mexican Peso
  MXN: {
    budget: [200, 600],
    moderate: [600, 1500],
    premium: [1500, 3500],
    luxury: [3500, null],
  },
  // South Korean Won
  KRW: {
    budget: [20000, 50000],
    moderate: [50000, 120000],
    premium: [120000, 250000],
    luxury: [250000, null],
  },
  // Hong Kong Dollar
  HKD: {
    budget: [150, 400],
    moderate: [400, 900],
    premium: [900, 1800],
    luxury: [1800, null],
  },
  // New Zealand Dollar
  NZD: {
    budget: [30, 70],
    moderate: [70, 150],
    premium: [150, 300],
    luxury: [300, null],
  },
  // Swiss Franc (high cost of living)
  CHF: {
    budget: [30, 70],
    moderate: [70, 150],
    premium: [150, 300],
    luxury: [300, null],
  },
  // Swedish Krona
  SEK: {
    budget: [250, 600],
    moderate: [600, 1400],
    premium: [1400, 2800],
    luxury: [2800, null],
  },
  // Norwegian Krone (high cost of living)
  NOK: {
    budget: [300, 700],
    moderate: [700, 1500],
    premium: [1500, 3000],
    luxury: [3000, null],
  },
  // Danish Krone
  DKK: {
    budget: [200, 500],
    moderate: [500, 1100],
    premium: [1100, 2200],
    luxury: [2200, null],
  },
  // Polish Zloty
  PLN: {
    budget: [50, 150],
    moderate: [150, 350],
    premium: [350, 700],
    luxury: [700, null],
  },
};

/**
 * Get default budget ranges for a currency code.
 * Defaults to USD ranges if the currency is not explicitly mapped.
 *
 * @param {string} currencyCode - ISO 4217 currency code (e.g., 'INR', 'EUR')
 * @returns {object} Budget ranges with keys: budget, moderate, premium, luxury
 */
export function getBudgetRangesForCurrency(currencyCode) {
  // Check exact match first
  if (CURRENCY_BUDGET_RANGES[currencyCode]) {
    return CURRENCY_BUDGET_RANGES[currencyCode];
  }

  // For unlisted currencies, default to USD ranges
  return CURRENCY_BUDGET_RANGES.USD;
}

/**
 * Format budget range with currency symbol.
 * Handles both fixed ranges (e.g., "₹500 – ₹1,500") and open-ended (e.g., "₹10,000+").
 *
 * @param {number} minValue - Minimum budget value
 * @param {number|null} maxValue - Maximum budget value (null for open-ended)
 * @param {string} currencySymbol - Currency symbol (e.g., '₹', '$', '£')
 * @returns {string} Formatted budget range
 *
 * @example
 * formatBudgetRange(0, 30, '$')  // "$0 – $30"
 * formatBudgetRange(150, null, '$')  // "$150+"
 * formatBudgetRange(500, 1500, '₹')  // "₹500 – ₹1,500"
 * formatBudgetRange(10000, null, '₹')  // "₹10,000+"
 */
export function formatBudgetRange(minValue, maxValue, currencySymbol) {
  const formatNumber = (num) => {
    // Format with commas for thousands
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  if (maxValue === null) {
    return `${currencySymbol}${formatNumber(minValue)}+`;
  }

  return `${currencySymbol}${formatNumber(minValue)} – ${currencySymbol}${formatNumber(maxValue)}`;
}

/**
 * Get budget options with localized currency formatting.
 * Returns the same structure as BUDGET_OPTIONS but with descriptions
 * formatted according to the provided currency.
 *
 * @param {string} currencyCode - ISO 4217 currency code (e.g., 'INR')
 * @param {string} currencySymbol - Currency symbol (e.g., '₹')
 * @returns {array} Budget options with formatted descriptions
 *
 * @example
 * const options = getBudgetOptionsForCurrency('INR', '₹');
 * // Returns:
 * // [
 * //   { value: 'budget', label: 'Budget', description: '₹0 – ₹1,500 / person' },
 * //   ...
 * // ]
 */
export function getBudgetOptionsForCurrency(currencyCode, currencySymbol) {
  const ranges = getBudgetRangesForCurrency(currencyCode);

  return [
    {
      value: 'budget',
      label: 'Budget',
      description: `${formatBudgetRange(ranges.budget[0], ranges.budget[1], currencySymbol)} / person`,
    },
    {
      value: 'moderate',
      label: 'Moderate',
      description: `${formatBudgetRange(ranges.moderate[0], ranges.moderate[1], currencySymbol)} / person`,
    },
    {
      value: 'premium',
      label: 'Premium',
      description: `${formatBudgetRange(ranges.premium[0], ranges.premium[1], currencySymbol)} / person`,
    },
    {
      value: 'luxury',
      label: 'Luxury',
      description: `${formatBudgetRange(ranges.luxury[0], ranges.luxury[1], currencySymbol)} / person`,
    },
  ];
}

/**
 * Extract currency metadata from an itinerary plan object.
 * Safe accessor that handles missing currency data gracefully.
 *
 * @param {object} plan - Generated itinerary plan object
 * @returns {object} Currency metadata with defaults: { code, symbol, name }
 *
 * @example
 * const currency = getCurrencyFromPlan(plan);
 * console.log(currency.symbol); // '₹'
 */
export function getCurrencyFromPlan(plan) {
  const defaultCurrency = {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
  };

  if (!plan || !plan.meta || !plan.meta.currency) {
    return defaultCurrency;
  }

  return {
    code: plan.meta.currency.code || defaultCurrency.code,
    symbol: plan.meta.currency.symbol || defaultCurrency.symbol,
    name: plan.meta.currency.name || defaultCurrency.name,
  };
}

/**
 * Format a price value with currency symbol.
 * Handles number formatting and localization.
 *
 * @param {number} value - Numeric value
 * @param {string} currencySymbol - Currency symbol
 * @param {boolean} [compact=false] - If true, use compact format (e.g., "₹2k")
 * @returns {string} Formatted price
 *
 * @example
 * formatPrice(2500, '₹')  // "₹2,500"
 * formatPrice(1000000, '$', true)  // "$1M"
 */
export function formatPrice(value, currencySymbol, compact = false) {
  if (compact && value >= 1000) {
    if (value >= 1000000) {
      return `${currencySymbol}${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${currencySymbol}${(value / 1000).toFixed(1)}k`;
    }
  }

  return `${currencySymbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
