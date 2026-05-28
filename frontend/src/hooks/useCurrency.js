import { useMemo } from 'react';
import { getBudgetOptionsForCurrency } from '../utils/currency';

/**
 * Currency mapping based on approximate latitude/longitude ranges.
 * This is a simplified approach for demo purposes.
 * Production apps should use a proper geocoding service or IP-based detection.
 *
 * Regions are checked in order, so more specific regions should come first.
 */
const CURRENCY_BY_REGION = [
  // Singapore (small, specific region - check first)
  { minLat: 1.1, maxLat: 1.5, minLng: 103.6, maxLng: 104.1, code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
  
  // Hong Kong (small, specific region)
  { minLat: 22.1, maxLat: 22.6, minLng: 113.8, maxLng: 114.4, code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  
  // Switzerland (before broader Europe check)
  { minLat: 45.8, maxLat: 47.8, minLng: 5.9, maxLng: 10.5, code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  
  // UK (before broader Europe check)
  { minLat: 49, maxLat: 61, minLng: -8, maxLng: 2, code: 'GBP', symbol: '£', name: 'British Pound' },
  
  // Scandinavia
  { minLat: 55, maxLat: 71, minLng: 4, maxLng: 31, code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' }, // Norway
  { minLat: 55, maxLat: 69, minLng: 10, maxLng: 24, code: 'SEK', symbol: 'kr', name: 'Swedish Krona' }, // Sweden
  { minLat: 54.5, maxLat: 58, minLng: 8, maxLng: 15.2, code: 'DKK', symbol: 'kr', name: 'Danish Krone' }, // Denmark
  
  // Poland
  { minLat: 49, maxLat: 55, minLng: 14, maxLng: 24, code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  
  // Europe (broader - covers most of Western/Central Europe)
  { minLat: 36, maxLat: 71, minLng: -10, maxLng: 40, code: 'EUR', symbol: '€', name: 'Euro' },
  
  // India
  { minLat: 8, maxLat: 35, minLng: 68, maxLng: 97, code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  
  // Japan
  { minLat: 30, maxLat: 46, minLng: 129, maxLng: 146, code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  
  // South Korea
  { minLat: 33, maxLat: 39, minLng: 124, maxLng: 132, code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  
  // China (broader region)
  { minLat: 18, maxLat: 54, minLng: 73, maxLng: 135, code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  
  // Thailand
  { minLat: 5, maxLat: 21, minLng: 97, maxLng: 106, code: 'THB', symbol: '฿', name: 'Thai Baht' },
  
  // Australia
  { minLat: -44, maxLat: -10, minLng: 113, maxLng: 154, code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  
  // New Zealand
  { minLat: -47, maxLat: -34, minLng: 166, maxLng: 179, code: 'NZD', symbol: '$', name: 'New Zealand Dollar' },
  
  // Brazil
  { minLat: -34, maxLat: 5, minLng: -74, maxLng: -34, code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  
  // Mexico
  { minLat: 14, maxLat: 33, minLng: -118, maxLng: -86, code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  
  // Canada (before USA to avoid overlap)
  { minLat: 41, maxLat: 84, minLng: -141, maxLng: -52, code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  
  // South Africa
  { minLat: -35, maxLat: -22, minLng: 16, maxLng: 33, code: 'ZAR', symbol: 'R', name: 'South African Rand' },
];

/**
 * Detect currency based on latitude and longitude.
 * Falls back to USD if no match is found.
 *
 * @param {number|null} latitude
 * @param {number|null} longitude
 * @returns {object} Currency metadata: { code, symbol, name }
 */
function detectCurrencyFromCoordinates(latitude, longitude) {
  const defaultCurrency = { code: 'USD', symbol: '$', name: 'US Dollar' };

  if (latitude == null || longitude == null) {
    return defaultCurrency;
  }

  // Find matching region
  for (const region of CURRENCY_BY_REGION) {
    if (
      latitude >= region.minLat &&
      latitude <= region.maxLat &&
      longitude >= region.minLng &&
      longitude <= region.maxLng
    ) {
      return {
        code: region.code,
        symbol: region.symbol,
        name: region.name,
      };
    }
  }

  // Default to USD for unmatched regions (e.g., USA, most of Americas)
  return defaultCurrency;
}

/**
 * Hook to get currency information and budget options based on user location.
 *
 * @param {number|null} latitude - User's latitude
 * @param {number|null} longitude - User's longitude
 * @returns {object} Currency data and budget options
 *
 * @example
 * const { currency, budgetOptions } = useCurrency(latitude, longitude);
 * console.log(currency.symbol); // '₹'
 * console.log(budgetOptions[0].description); // '₹0 – ₹1,500 / person'
 */
export function useCurrency(latitude, longitude) {
  const currency = useMemo(
    () => detectCurrencyFromCoordinates(latitude, longitude),
    [latitude, longitude]
  );

  const budgetOptions = useMemo(
    () => getBudgetOptionsForCurrency(currency.code, currency.symbol),
    [currency.code, currency.symbol]
  );

  return {
    currency,
    budgetOptions,
  };
}

export default useCurrency;
