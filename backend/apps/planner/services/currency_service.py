"""
Currency detection and formatting service.

Maps user location (latitude/longitude) to currency information based on country.
Provides localized currency symbols, codes, and formatting.
"""

import logging
from typing import NamedTuple, Optional

logger = logging.getLogger(__name__)


class CurrencyInfo(NamedTuple):
    """Currency metadata for a location."""

    currency_code: str
    """ISO 4217 currency code (e.g., 'USD', 'INR', 'GBP')."""

    currency_symbol: str
    """Display symbol for the currency (e.g., '$', '₹', '£')."""

    currency_name: str
    """Display name of the currency (e.g., 'US Dollar', 'Indian Rupee')."""


# Country to Currency Mapping
# Maps ISO 3166-1 alpha-2 country codes to currency info
COUNTRY_TO_CURRENCY = {
    # Americas
    'US': CurrencyInfo('USD', '$', 'US Dollar'),
    'CA': CurrencyInfo('CAD', '$', 'Canadian Dollar'),
    'MX': CurrencyInfo('MXN', '$', 'Mexican Peso'),
    'BR': CurrencyInfo('BRL', 'R$', 'Brazilian Real'),
    'AR': CurrencyInfo('ARS', '$', 'Argentine Peso'),
    'CL': CurrencyInfo('CLP', '$', 'Chilean Peso'),
    'CO': CurrencyInfo('COP', '$', 'Colombian Peso'),
    'PE': CurrencyInfo('PEN', 'S/', 'Peruvian Sol'),
    'VE': CurrencyInfo('VES', 'Bs.', 'Venezuelan Bolívar'),
    'JM': CurrencyInfo('JMD', '$', 'Jamaican Dollar'),
    'DO': CurrencyInfo('DOP', '$', 'Dominican Peso'),
    # Europe
    'DE': CurrencyInfo('EUR', '€', 'Euro'),
    'AT': CurrencyInfo('EUR', '€', 'Euro'),
    'BE': CurrencyInfo('EUR', '€', 'Euro'),
    'CY': CurrencyInfo('EUR', '€', 'Euro'),
    'EE': CurrencyInfo('EUR', '€', 'Euro'),
    'ES': CurrencyInfo('EUR', '€', 'Euro'),
    'FI': CurrencyInfo('EUR', '€', 'Euro'),
    'FR': CurrencyInfo('EUR', '€', 'Euro'),
    'GR': CurrencyInfo('EUR', '€', 'Euro'),
    'IE': CurrencyInfo('EUR', '€', 'Euro'),
    'IT': CurrencyInfo('EUR', '€', 'Euro'),
    'LV': CurrencyInfo('EUR', '€', 'Euro'),
    'LT': CurrencyInfo('EUR', '€', 'Euro'),
    'LU': CurrencyInfo('EUR', '€', 'Euro'),
    'MT': CurrencyInfo('EUR', '€', 'Euro'),
    'NL': CurrencyInfo('EUR', '€', 'Euro'),
    'PT': CurrencyInfo('EUR', '€', 'Euro'),
    'SI': CurrencyInfo('EUR', '€', 'Euro'),
    'SK': CurrencyInfo('EUR', '€', 'Euro'),
    'GB': CurrencyInfo('GBP', '£', 'British Pound'),
    'CH': CurrencyInfo('CHF', 'CHF', 'Swiss Franc'),
    'SE': CurrencyInfo('SEK', 'kr', 'Swedish Krona'),
    'NO': CurrencyInfo('NOK', 'kr', 'Norwegian Krone'),
    'DK': CurrencyInfo('DKK', 'kr', 'Danish Krone'),
    'CZ': CurrencyInfo('CZK', 'Kč', 'Czech Koruna'),
    'HU': CurrencyInfo('HUF', 'Ft', 'Hungarian Forint'),
    'PL': CurrencyInfo('PLN', 'zł', 'Polish Zloty'),
    'RO': CurrencyInfo('RON', 'lei', 'Romanian Leu'),
    'RU': CurrencyInfo('RUB', '₽', 'Russian Ruble'),
    'UA': CurrencyInfo('UAH', '₴', 'Ukrainian Hryvnia'),
    'TR': CurrencyInfo('TRY', '₺', 'Turkish Lira'),
    # Middle East & North Africa
    'AE': CurrencyInfo('AED', 'د.إ', 'UAE Dirham'),
    'SA': CurrencyInfo('SAR', '﷼', 'Saudi Riyal'),
    'QA': CurrencyInfo('QAR', '﷼', 'Qatari Riyal'),
    'KW': CurrencyInfo('KWD', 'د.ك', 'Kuwaiti Dinar'),
    'BH': CurrencyInfo('BHD', 'ب.د', 'Bahraini Dinar'),
    'OM': CurrencyInfo('OMR', 'ر.ع.', 'Omani Rial'),
    'JO': CurrencyInfo('JOD', 'د.ا', 'Jordanian Dinar'),
    'IL': CurrencyInfo('ILS', '₪', 'Israeli Shekel'),
    'EG': CurrencyInfo('EGP', '£', 'Egyptian Pound'),
    'MA': CurrencyInfo('MAD', 'د.م.', 'Moroccan Dirham'),
    'TN': CurrencyInfo('TND', 'د.ت', 'Tunisian Dinar'),
    'DZ': CurrencyInfo('DZD', 'د.ج', 'Algerian Dinar'),
    # Asia Pacific
    'IN': CurrencyInfo('INR', '₹', 'Indian Rupee'),
    'JP': CurrencyInfo('JPY', '¥', 'Japanese Yen'),
    'CN': CurrencyInfo('CNY', '¥', 'Chinese Yuan'),
    'HK': CurrencyInfo('HKD', 'HK$', 'Hong Kong Dollar'),
    'TW': CurrencyInfo('TWD', 'NT$', 'New Taiwan Dollar'),
    'SG': CurrencyInfo('SGD', 'S$', 'Singapore Dollar'),
    'MY': CurrencyInfo('MYR', 'RM', 'Malaysian Ringgit'),
    'TH': CurrencyInfo('THB', '฿', 'Thai Baht'),
    'VN': CurrencyInfo('VND', '₫', 'Vietnamese Dong'),
    'PH': CurrencyInfo('PHP', '₱', 'Philippine Peso'),
    'ID': CurrencyInfo('IDR', 'Rp', 'Indonesian Rupiah'),
    'KR': CurrencyInfo('KRW', '₩', 'South Korean Won'),
    'KP': CurrencyInfo('KPW', '₩', 'North Korean Won'),
    'BD': CurrencyInfo('BDT', '৳', 'Bangladeshi Taka'),
    'PK': CurrencyInfo('PKR', '₨', 'Pakistani Rupee'),
    'LK': CurrencyInfo('LKR', 'Rs', 'Sri Lankan Rupee'),
    'NP': CurrencyInfo('NPR', '₨', 'Nepalese Rupee'),
    'AU': CurrencyInfo('AUD', '$', 'Australian Dollar'),
    'NZ': CurrencyInfo('NZD', '$', 'New Zealand Dollar'),
    'FJ': CurrencyInfo('FJD', '$', 'Fiji Dollar'),
    # Africa
    'ZA': CurrencyInfo('ZAR', 'R', 'South African Rand'),
    'NG': CurrencyInfo('NGN', '₦', 'Nigerian Naira'),
    'KE': CurrencyInfo('KES', 'Sh', 'Kenyan Shilling'),
    'GH': CurrencyInfo('GHS', '₵', 'Ghanaian Cedi'),
    'ET': CurrencyInfo('ETB', 'Br', 'Ethiopian Birr'),
    'UG': CurrencyInfo('UGX', 'Sh', 'Ugandan Shilling'),
    'TZ': CurrencyInfo('TZS', 'Sh', 'Tanzanian Shilling'),
}

# Geographic bounding boxes for countries (lat_min, lat_max, lon_min, lon_max)
# Used for fast geolocation-to-country lookup without external API
COUNTRY_BOUNDS = {
    'US': (24.5, 49.4, -125.0, -66.9),
    'CA': (41.7, 83.1, -141.0, -52.6),
    'MX': (14.5, 32.7, -117.1, -86.7),
    'BR': (-33.7, 5.3, -73.9, -34.8),
    'AR': (-55.5, -21.8, -73.6, -53.6),
    'CL': (-56.7, -17.5, -81.4, -66.4),
    'CO': (-4.2, 12.5, -77.3, -66.9),
    'PE': (-18.4, -0.0, -81.3, -68.7),
    'GB': (50.0, 59.0, -8.6, 1.8),
    'IE': (51.4, 55.4, -10.6, -5.4),
    'FR': (42.3, 51.1, -5.5, 8.2),
    'DE': (47.3, 55.1, 5.9, 15.0),
    'IT': (36.6, 47.1, 6.6, 18.8),
    'ES': (36.0, 43.8, -9.3, 3.3),
    'PT': (37.0, 42.2, -9.5, -6.2),
    'CH': (45.8, 47.8, 5.9, 10.5),
    'SE': (55.3, 69.0, 10.6, 24.2),
    'NO': (57.9, 71.2, 4.7, 31.3),
    'DK': (54.6, 57.7, 8.1, 12.7),
    'CZ': (48.5, 51.0, 12.1, 18.9),
    'PL': (49.0, 54.8, 14.1, 24.1),
    'RU': (41.1, 81.8, 19.6, 169.4),
    'IN': (8.0, 35.0, 68.1, 97.4),
    'JP': (30.4, 45.5, 123.0, 145.9),
    'CN': (18.2, 53.6, 73.5, 135.0),
    'AU': (-47.0, -9.2, 113.0, 154.0),
    'ZA': (-34.8, -22.1, 16.5, 32.9),
    'NG': (4.3, 13.9, 2.7, 14.7),
    'EG': (21.7, 31.6, 24.7, 36.9),
    'KE': (-4.7, 5.0, 33.9, 41.9),
    'SG': (1.2, 1.5, 103.6, 104.1),
    'MY': (0.8, 6.7, 99.6, 119.3),
    'TH': (5.6, 20.5, 97.3, 105.6),
    'VN': (8.6, 23.4, 102.2, 109.5),
    'PH': (5.0, 19.6, 121.0, 126.6),
    'ID': (-11.0, 5.9, 95.0, 141.0),
    'KR': (33.1, 43.0, 124.6, 131.9),
    'HK': (22.2, 22.5, 113.8, 114.4),
    'TW': (22.0, 25.2, 119.5, 121.9),
}

# Default fallback currency
DEFAULT_CURRENCY = CurrencyInfo('USD', '$', 'US Dollar')


class CurrencyService:
    """Detects and provides currency information based on geolocation."""

    @staticmethod
    def get_currency_from_coordinates(
        latitude: float,
        longitude: float,
    ) -> CurrencyInfo:
        """
        Detect currency from geographic coordinates (latitude, longitude).

        Uses geographic bounding boxes for fast lookup. Falls back to USD if no match.

        Args:
            latitude: Geographic latitude (-90 to 90)
            longitude: Geographic longitude (-180 to 180)

        Returns:
            CurrencyInfo with currency details for the detected location.
        """
        try:
            # Find matching country using bounding boxes
            for country_code, (lat_min, lat_max, lon_min, lon_max) in COUNTRY_BOUNDS.items():
                if lat_min <= latitude <= lat_max and lon_min <= longitude <= lon_max:
                    currency_info = COUNTRY_TO_CURRENCY.get(country_code)
                    if currency_info:
                        logger.info(
                            'Detected currency %s for coordinates (%.2f, %.2f)',
                            currency_info.currency_code,
                            latitude,
                            longitude,
                        )
                        return currency_info

            # No match found, log and return default
            logger.warning(
                'No currency detected for coordinates (%.2f, %.2f), using default',
                latitude,
                longitude,
            )
            return DEFAULT_CURRENCY

        except (TypeError, ValueError) as exc:
            logger.error('Error detecting currency from coordinates: %s', exc)
            return DEFAULT_CURRENCY

    @staticmethod
    def get_currency_info(currency_code: str) -> Optional[CurrencyInfo]:
        """
        Get currency info by ISO 4217 code.

        Args:
            currency_code: ISO 4217 currency code (e.g., 'USD', 'INR')

        Returns:
            CurrencyInfo if found, None otherwise.
        """
        # Search through the mapping for matching currency code
        for currency_info in COUNTRY_TO_CURRENCY.values():
            if currency_info.currency_code == currency_code:
                return currency_info
        return None

    @staticmethod
    def format_budget_range(
        min_value: float,
        max_value: Optional[float],
        currency_symbol: str,
        is_minimum: bool = False,
    ) -> str:
        """
        Format a budget range with currency symbol.

        Args:
            min_value: Minimum budget value
            max_value: Maximum budget value (None for open-ended like '$150+')
            currency_symbol: Currency symbol to display
            is_minimum: If True, format as '{symbol}{value}+' (for 'from' budgets)

        Returns:
            Formatted budget string like '₹2,000' or '₹2,000 – ₹5,000'
        """
        if is_minimum or max_value is None:
            return f'{currency_symbol}{min_value:,.0f}+'
        return f'{currency_symbol}{min_value:,.0f} – {currency_symbol}{max_value:,.0f}'
