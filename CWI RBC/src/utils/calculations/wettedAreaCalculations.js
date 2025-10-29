// Wetted area calculations for recharge basin design
import { SQFT_IN_SQYD, SQYD_IN_ACRE } from '../constants.js';

/**
 * Calculate the outside length of the wetted area (1/4 of perimeter)
 * @param {number} perimeter - Total perimeter of the pond in feet
 * @returns {number} Outside length in feet
 */
export const calculateOutsideLengthWettedArea = (perimeter) => {
  return perimeter / 4;
};

/**
 * Calculate the reduction in wetted area due to outside levee slope
 * @param {Object} formData - Form data containing freeboard_depth, water_depth, outside_slope_ratio
 * @returns {number} Length reduction in feet
 */
export const calculateLessOutsideLevee = ({ freeboard_depth, water_depth, outside_slope_ratio }) => {
  return ((freeboard_depth + water_depth) * outside_slope_ratio) * 2;
};

/**
 * Calculate the reduction in wetted area due to top levee width
 * @param {Object} formData - Form data containing levee_width
 * @returns {number} Length reduction in feet
 */
export const calculateLessTopLevee = ({ levee_width }) => {
  return levee_width * 2;
};

/**
 * Calculate the reduction in wetted area due to inside levee slope
 * @param {Object} formData - Form data containing freeboard_depth, water_depth, inside_slope_ratio
 * @returns {number} Length reduction in feet
 */
export const calculateLessInsideLevee = ({ freeboard_depth, water_depth, inside_slope_ratio }) => {
  return ((freeboard_depth + water_depth) * inside_slope_ratio) * 2;
};

/**
 * Calculate the addition to wetted area from wetted inside levee slope
 * @param {Object} formData - Form data containing water_depth, inside_slope_ratio
 * @returns {number} Length addition in feet
 */
export const calculatePlusWettedInsideLevee = ({ water_depth, inside_slope_ratio }) => {
  return (water_depth * inside_slope_ratio) * 2;
};

/**
 * Calculate the net inside length of wetted area after all adjustments
 * @param {number} outside_length_wetted_area - Base outside length
 * @param {number} less_outside_levee - Reduction from outside levee
 * @param {number} less_top_levee - Reduction from top levee
 * @param {number} less_inside_levee - Reduction from inside levee
 * @param {number} plus_wetted_inside_levee - Addition from wetted inside levee
 * @returns {number} Net inside length in feet
 */
export const calculateNetInsideLengthWettedArea = (outside_length_wetted_area, less_outside_levee, less_top_levee, less_inside_levee, plus_wetted_inside_levee) => {
  return (outside_length_wetted_area - (less_outside_levee + less_top_levee + less_inside_levee) + plus_wetted_inside_levee);
};

/**
 * Calculate the wetted area in square yards
 * @param {number} net_inside_length_wetted_area - Net inside length in feet
 * @returns {number} Wetted area in square yards
 */
export const calculateWettedAreaSqYds = (net_inside_length_wetted_area) => {
  return net_inside_length_wetted_area**2 / SQFT_IN_SQYD;
};

/**
 * Calculate the wetted area in acres
 * @param {number} wetted_area_sq_yds - Wetted area in square yards
 * @returns {number} Wetted area in acres
 */
export const calculateWettedAreaAcres = (wetted_area_sq_yds) => {
  return wetted_area_sq_yds / SQYD_IN_ACRE;
};

/**
 * Calculate the wetted area as a percentage of total pond area
 * @param {Object} formData - Form data containing ac_pond
 * @param {number} wetted_area_acres - Wetted area in acres
 * @returns {number} Percentage of wetted area relative to total pond area
 */
export const calculateWettedAreaGrossPercent = ({ ac_pond }, wetted_area_acres) => {
  return (wetted_area_acres / ac_pond) * 100;
};

/**
 * Calculate all wetted area values for a recharge basin
 * @param {Object} formData - Form data containing all necessary pond dimensions
 * @param {number} perimeter - Total perimeter of the pond in feet
 * @returns {Object} Object containing all wetted area calculations
 */
export const calculateAllWettedArea = (formData, perimeter) => {
  const outside_length_wetted_area = calculateOutsideLengthWettedArea(perimeter);
  const less_outside_levee = calculateLessOutsideLevee(formData);
  const less_top_levee = calculateLessTopLevee(formData);
  const less_inside_levee = calculateLessInsideLevee(formData);
  const plus_wetted_inside_levee = calculatePlusWettedInsideLevee(formData);
  const net_inside_length_wetted_area = calculateNetInsideLengthWettedArea(
    outside_length_wetted_area, 
    less_outside_levee, 
    less_top_levee, 
    less_inside_levee, 
    plus_wetted_inside_levee
  );
  const wetted_area_sq_yds = calculateWettedAreaSqYds(net_inside_length_wetted_area);
  const wetted_area_acres = calculateWettedAreaAcres(wetted_area_sq_yds);
  const wetted_area_gross_percent = calculateWettedAreaGrossPercent(formData, wetted_area_acres);

  return {
    outside_length_wetted_area,
    less_outside_levee,
    less_top_levee,
    less_inside_levee,
    plus_wetted_inside_levee,
    net_inside_length_wetted_area,
    wetted_area_sq_yds,
    wetted_area_acres,
    wetted_area_gross_percent
  };
};