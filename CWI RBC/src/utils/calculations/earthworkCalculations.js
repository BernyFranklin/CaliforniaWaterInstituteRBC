// Earthwork and levee calculations for recharge basin design
import { CUFT_IN_CUYD } from '../constants.js';

/**
 * Calculate the volume of earthwork for the center portion of the levee
 * @param {Object} formData - Form data containing freeboard_depth, water_depth, levee_width
 * @param {number} perimeter - Total perimeter of the pond in feet
 * @param {number} cuftInCuyd - Cubic feet per cubic yard conversion factor
 * @returns {number} Volume in cubic yards
 */
export const calculateCenterOfLevee = ({freeboard_depth, water_depth, levee_width}, perimeter, cuftInCuyd = CUFT_IN_CUYD) => {
  return (perimeter * (freeboard_depth + water_depth) * levee_width) / cuftInCuyd;
};

/**
 * Calculate the volume of earthwork for the inside slope of the levee
 * @param {Object} formData - Form data containing freeboard_depth, water_depth, inside_slope_ratio, width_pond, length_pond
 * @param {number} cuftInCuyd - Cubic feet per cubic yard conversion factor
 * @returns {number} Volume in cubic yards
 */
export const calculateInsideOfLevee = ({freeboard_depth, water_depth, inside_slope_ratio, width_pond, length_pond}, cuftInCuyd = CUFT_IN_CUYD) => {
  return (((2 * (freeboard_depth + water_depth) * inside_slope_ratio  * (width_pond + length_pond) * 2) / 2) / cuftInCuyd);
};

/**
 * Calculate the volume of earthwork for the outside slope of the levee
 * @param {Object} formData - Form data containing freeboard_depth, water_depth, outside_slope_ratio, width_pond, length_pond
 * @param {number} cuftInCuyd - Cubic feet per cubic yard conversion factor
 * @returns {number} Volume in cubic yards
 */
export const calculateOutsideOfLevee = ({freeboard_depth, water_depth, outside_slope_ratio, width_pond, length_pond}, cuftInCuyd = CUFT_IN_CUYD) => {
  return (((2 * (freeboard_depth + water_depth) * outside_slope_ratio  * (width_pond + length_pond) * 2) / 2) / cuftInCuyd);
};

/**
 * Calculate the total volume of earthwork by summing all levee components
 * @param {number} center_of_levee - Volume of center levee in cubic yards
 * @param {number} inside_of_levee - Volume of inside slope in cubic yards
 * @param {number} outside_of_levee - Volume of outside slope in cubic yards
 * @returns {number} Total volume in cubic yards
 */
export const calculateTotalVolumeOfEarthwork = (center_of_levee, inside_of_levee, outside_of_levee) => {
  return center_of_levee + inside_of_levee + outside_of_levee;
};

/**
 * Calculate the total cost of earthwork based on volume and unit cost
 * @param {Object} formData - Form data containing earthwork_cost_per_cy
 * @param {number} total_volume_of_earthwork - Total earthwork volume in cubic yards
 * @returns {number} Total earthwork cost in dollars
 */
export const calculateCostOfEarthwork = ({ earthwork_cost_per_cy }, total_volume_of_earthwork) => {
  return total_volume_of_earthwork * earthwork_cost_per_cy;
};

/**
 * Calculate the perimeter of a rectangular pond
 * @param {number} width_pond - Width of pond in feet
 * @param {number} length_pond - Length of pond in feet
 * @returns {number} Perimeter in feet
 */
export const calculatePerimeter = (width_pond, length_pond) => {
  return (width_pond * 2) + (length_pond * 2);
};

/**
 * Calculate all earthwork-related values for a recharge basin
 * @param {Object} formData - Form data containing all necessary pond dimensions and costs
 * @returns {Object} Object containing all earthwork calculations
 */
export const calculateAllEarthwork = (formData) => {
  const perimeter = calculatePerimeter(formData.width_pond, formData.length_pond);
  const center_of_levee = calculateCenterOfLevee(formData, perimeter);
  const inside_of_levee = calculateInsideOfLevee(formData);
  const outside_of_levee = calculateOutsideOfLevee(formData);
  const total_volume_of_earthwork = calculateTotalVolumeOfEarthwork(center_of_levee, inside_of_levee, outside_of_levee);
  const total_cost_of_earthwork = calculateCostOfEarthwork(formData, total_volume_of_earthwork);

  return {
    perimeter,
    center_of_levee,
    inside_of_levee,
    outside_of_levee,
    total_volume_of_earthwork,
    total_cost_of_earthwork
  };
};