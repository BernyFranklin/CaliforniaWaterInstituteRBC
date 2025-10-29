// Number formatting utilities for recharge basin calculations

/**
 * Format a number with commas as thousand separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number with commas
 */
export const formatWithCommas = (num) => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

/**
 * Format a number as currency (USD)
 * @param {number|null} num - The number to format as currency
 * @returns {string} Formatted currency string or "-" if null
 */
export const toPrice = (num) => {
  if (num === null) return "-";
  return num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

/**
 * Format a quantity number with one decimal place
 * @param {number|null} num - The number to format
 * @returns {string} Formatted number with one decimal or "-" if null
 */
export const formatQty = (num) => {
  if (num === null) return "-";
  return num.toFixed(1);
};

/**
 * Format units string for display (adds " / " prefix if not empty)
 * @param {string} unit - The unit string
 * @returns {string} Formatted unit string with prefix or empty string
 */
export const formatUnits = (unit) => {
  if (unit === "") return "";
  return ` / ${unit}`;
};

/**
 * Format a number with commas and specified decimal places
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number with commas and decimals
 */
export const formatNumber = (num, decimals = 0) => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Format a percentage with specified decimal places
 * @param {number} num - The number to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (num, decimals = 1) => {
  return num.toFixed(decimals) + '%';
};