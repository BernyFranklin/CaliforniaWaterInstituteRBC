import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)


export function Hero() {
  return (
    <div className="hero has-shadow">
      <h1>California Water Institute</h1>
      <p>Innovative Solutions for Sustainable Water Management</p>
      <a href="https://www.californiawater.org/news/" target="_blank">
        <Button className="red-button" text="Learn More" />
      </a>
    </div>
  )
}

export function AboutSection() {
  return (
    <section id="about-section">
      <div className="has-shadow" id="about-header">
        <h2>About CWI</h2>
        <p>The California Water Institute is separated into three divisions: The Center for Irrigation Technology (CIT), The Water, Energy and Technology Center (WET), and the Division of Research & Education.</p>
      </div>
      <div className="has-shadow" id="about-text">
        <p>Water is the basis of life and human society. It flows across countless industries and impacts every household. In California, particularly in the San Joaquin Valley, water management remains a significant challenge as the region must overcome challenges related to climate change, population growth and the increased demand on finite water resources. The California Water Institute focuses on all aspects of sustainable water resource management solutions through outreach, entrepreneurship, education, testing, and interdisciplinary research.</p>
        <p>Through hands-on learning and research opportunities fostered by the Institute, students are prepared to enter the workforce as well-trained graduates. At the same time, water stakeholders are an important resource to help CWI and Fresno State develop the next generation of professionals through our partnerships. CWI’s collaborative and comprehensive approach to water management solutions is a prime example of what we can accomplish when the University and the community work together to address and solve current and future water issues. Together, we can shape the future of sustainable water resource management and successfully overcome the challenges that lie ahead.</p>
        <p>CWI provides all stakeholders with convenient access to Fresno State’s extensive water research and development programs and services. The institute positions Fresno State as a leader in water research and sustainability by engaging the campus community and academic experts from all disciplines to address the most challenging water issues of our time.</p>
      </div>
    </section>
  )
}

export function ConceptDesign() {
  return (
    <div className="has-shadow" id="concept-design-section">
      <h2>Concept Design Placeholder</h2>
    </div>
  )
}

export function RechargeBasinCalculator() {
  
  const [formContent, setFormContent] = useState(0);
  const defaultFormData = {
    ac_pond: '',
    length_pond: '',
    width_pond: '',
    inside_slope_ratio: '',
    outside_slope_ratio: '',
    levee_width: '',
    slope_across_pond: '',
    freeboard_depth: '',
    water_depth: '',
    infiltration_rate: '',
    soil_type: '',
    wet_year_freq: '',
    num_wet_months: '',
    land_cost_per_acre: '',
    pipeline_length: '',
    earthwork_cost_per_cy: '',
    annual_interest_rate: '',
    loan_length: '',
    cost_recharge_water: '',
    value_stored_water: '',
    cost_om: ''
  }
  const [formData, setFormData] = useState(() => {
    // Load saved data from localStorage or default values
    const saved = localStorage.getItem("formData");
    return saved ? JSON.parse(saved) : defaultFormData;
  });

  // Save data whenever formData changes
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // MAKE A RESET BUTTON THAT CLEARS LOCAL STORAGE AND SETS FORM DATA TO DEFAULT VALUES
  const handleChange = (e) => {
    let { name, value } = e.target;
    // Don't parse soil_type since it's a string
    if (name === "soil_type") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
      return;
    }
    // Prevents error when input is cleared
    value = (value === '') ? '' : parseFloat(value);
    // Sets state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }
  
  const contents = [
    <BasinSizeAndDesign formData={formData} handleChange={handleChange} />, 
    <WaterAvailability  formData={formData} handleChange={handleChange} />, 
    <DevelopmentCosts   formData={formData} handleChange={handleChange} />, 
    <WaterCosts         formData={formData} handleChange={handleChange} />, 
    <RoiResults         formData={formData}/>
  ]

  return (
    <section className="has-shadow" id="calculator-section">
      <CalculatorHeader />
      <ProgressBar current={formContent} />
      <div id="calculator-form">
        <form>
          { contents[formContent] }
        </form>
        <ButtonBar 
          formContent={formContent} 
          setFormContent={setFormContent}
          contents={contents}
        />
      </div>
    </section>
  )
}

function CalculatorHeader() {
  return (
    <div id="calculator-header">
      <h2>Water Recharge Basin Calculator</h2>
      <p>This calculator is intended to help farmers determine whether a recharge basin on or near their property is worthwhile. This tool provides only a preliminary cost estimate. Recharge basins should be professionally designed to reduce the risk of basin failure. Farmers should consult with your water district manager regarding the frequency of availability and cost of recharge water. At the moment, this calculator is still work in progress, and has been discussed at just one Technical Committee Meeting of the Water Blueprint. At the moment, the calculator assumes one basin on flat land. </p>
    </div>
  )
}

function ButtonBar({formContent, setFormContent, contents}) {
  const backButtonColor = (formContent === 0) ? "gray-button" : "red-button";
  
  function NextOrSubmitButton() {
    const buttonText = (formContent === contents.length - 2) ? "Submit" : "Next";
    return (<Button className="red-button" text={buttonText} />)
  }

  const handleBackClick = () => {
    (formContent > 0) ? setFormContent(formContent - 1) : setFormContent(formContent);
  }

  const handleSubmitClick = () => {
    setFormContent(4);
  }

  const handleNextClick = () => {
    (formContent < contents.length - 2) ? setFormContent(formContent + 1) : handleSubmitClick();
  }

  return (
    <div className="button-bar">
      <span className="button-bar-left">
        <a onClick={handleBackClick}><Button className={`${backButtonColor}`} text="Back" /></a>
      </span>
      {(formContent !== 4) && <span className="button-bar-right"><a onClick={handleNextClick}><NextOrSubmitButton/></a></span>}
    </div>
  )
}

const calculateCenterOfLevee = ({freeboard_depth, water_depth, levee_width}, perimeter, cuft_in_cuyd) => {

  return (perimeter * (freeboard_depth + water_depth) * levee_width) / cuft_in_cuyd;
}

const calculateInsideOfLevee = ({freeboard_depth, water_depth, inside_slope_ratio, width_pond, length_pond}, cuft_in_cuyd) => {
  return (((2 * (freeboard_depth + water_depth) * inside_slope_ratio  * (width_pond + length_pond) * 2) / 2) / cuft_in_cuyd);
}

const calculateOutsideOfLevee = ({freeboard_depth, water_depth, outside_slope_ratio, width_pond, length_pond}, cuft_in_cuyd) => {
  return (((2 * (freeboard_depth + water_depth) * outside_slope_ratio  * (width_pond + length_pond) * 2) / 2) / cuft_in_cuyd);
}

const calculateTotalVolumeOfEarthwork = (center_of_levee, inside_of_levee, outside_of_levee) => {
  return center_of_levee + inside_of_levee + outside_of_levee;
}

const calculateCostOfEarthwork = ({ earthwork_cost_per_cy }, total_volume_of_earthwork) => {
  return total_volume_of_earthwork * earthwork_cost_per_cy;
}

const calculateOutsideLengthWettedArea = (perimeter) => {
  return perimeter / 4;
}

const calculateLessOutsideLevee = ({ freeboard_depth, water_depth, outside_slope_ratio }) => {
  return ((freeboard_depth + water_depth) * outside_slope_ratio) * 2;
}

const calculateLessTopLevee = ({ levee_width }) => {
  return levee_width * 2;
}

const calculateLessInsideLevee = ({ freeboard_depth, water_depth, inside_slope_ratio }) => {
  return ((freeboard_depth + water_depth) * inside_slope_ratio) * 2;
}

const calculatePlusWettedInsideLevee = ({ water_depth, inside_slope_ratio }) => {
  return (water_depth * inside_slope_ratio) * 2;
}

const calculateNetInsideLengthWettedArea = (outside_length_wetted_area, less_outside_levee, less_top_levee, less_inside_levee, plus_wetted_inside_levee) => {
  return (outside_length_wetted_area - (less_outside_levee + less_top_levee + less_inside_levee) + plus_wetted_inside_levee);
}

const calculateWettedAreaSqYds = (net_inside_length_wetted_area) => {
  const sqft_in_sqyd = 9;
  return net_inside_length_wetted_area**2 / sqft_in_sqyd;
}

const calculateWettedAreaAcres = (wetted_area_sq_yds) => {
  const sqyd_in_acre = 4840;
  return wetted_area_sq_yds / sqyd_in_acre;
}

const calculateWettedAreaGrossPercent = ({ ac_pond }, wetted_area_acres) => {
  return (wetted_area_acres / ac_pond) * 100;
}

const getCalculationsData = (formData) => {
  // Global Vars and Functions for Calculations 
  const cuft_in_cuyd = 27;
  // Calculations Section from spreadsheet
  const sqmi_per_acre = 1/640;
  const area_sqmi = formData.ac_pond * sqmi_per_acre;
  const perimeter = (formData.width_pond * 2) + (formData.length_pond * 2);
  const center_of_levee = calculateCenterOfLevee(formData, perimeter, cuft_in_cuyd);
  const inside_of_levee = calculateInsideOfLevee(formData, cuft_in_cuyd);
  const outside_of_levee = calculateOutsideOfLevee(formData, cuft_in_cuyd);
  const total_volume_of_earthwork = calculateTotalVolumeOfEarthwork(center_of_levee, inside_of_levee, outside_of_levee);
  const total_cost_of_earthwork = calculateCostOfEarthwork(formData, total_volume_of_earthwork);
  const outside_length_wetted_area = calculateOutsideLengthWettedArea(perimeter);
  const less_outside_levee = calculateLessOutsideLevee(formData);
  const less_top_levee = calculateLessTopLevee(formData);
  const less_inside_levee = calculateLessInsideLevee(formData);
  const plus_wetted_inside_levee = calculatePlusWettedInsideLevee(formData);
  const net_inside_length_wetted_area = calculateNetInsideLengthWettedArea(outside_length_wetted_area, less_outside_levee, less_top_levee, less_inside_levee, plus_wetted_inside_levee);
  const wetted_area_sq_yds = calculateWettedAreaSqYds(net_inside_length_wetted_area);
  const wetted_area_acres = calculateWettedAreaAcres(wetted_area_sq_yds);
  const wetted_area_gross_percent = calculateWettedAreaGrossPercent(formData, wetted_area_acres);
  // End of global vars and functions
  return {
    cuft_in_cuyd: cuft_in_cuyd,
    sqmi_per_acre: sqmi_per_acre,
    area_sqmi: area_sqmi,
    perimeter: perimeter,
    center_of_levee: center_of_levee,
    inside_of_levee: inside_of_levee,
    outside_of_levee: outside_of_levee,
    total_volume_of_earthwork: total_volume_of_earthwork,
    total_cost_of_earthwork: total_cost_of_earthwork,
    outside_length_wetted_area: outside_length_wetted_area,
    less_outside_levee: less_outside_levee,
    less_top_levee: less_top_levee,
    less_inside_levee: less_inside_levee,
    plus_wetted_inside_levee: plus_wetted_inside_levee,
    net_inside_length_wetted_area: net_inside_length_wetted_area,
    wetted_area_sq_yds: wetted_area_sq_yds,
    wetted_area_acres: wetted_area_acres,
    wetted_area_gross_percent: wetted_area_gross_percent
  };
}

function CalculationDataSection({formData}) {
  const calculations = getCalculationsData(formData);
  const dimensionData = [
    { label: "Area", value: `${calculations.area_sqmi.toFixed(2)} sq mi` },
    { label: "Perimeter", value: `${calculations.perimeter.toFixed(2)} ft` }
  ];

  const earthworkData = [
    { label: "Center of Levee", value: `${calculations.center_of_levee.toFixed(2)} cu yd` },
    { label: "Inside of Levee", value: `${calculations.inside_of_levee.toFixed(2)} cu yd` },
    { label: "Outside of Levee", value: `${calculations.outside_of_levee.toFixed(2)} cu yd` },
    { label: "Total Volume of Earthwork", value: `${calculations.total_volume_of_earthwork.toFixed(2)} cu yd` },
    { label: "Total Cost of Earthwork", value: `$${calculations.total_cost_of_earthwork.toFixed(2)}` }
  ];

  const wettedAreaData = [
    { label: "Outside Length", value: `${calculations.outside_length_wetted_area.toFixed(2)} ft` },
    { label: "Less Outside Levee", value: `${calculations.less_outside_levee.toFixed(2)} ft` },
    { label: "Less Top Levee", value: `${calculations.less_top_levee.toFixed(2)} ft` },
    { label: "Less Inside Levee", value: `${calculations.less_inside_levee.toFixed(2)} ft` },
    { label: "Plus Wetted Inside Levee", value: `${calculations.plus_wetted_inside_levee.toFixed(2)} ft` },
    { label: "Net Inside Length", value: `${calculations.net_inside_length_wetted_area.toFixed(2)} ft` },
    { label: "Wetted Area (sq yds)", value: `${calculations.wetted_area_sq_yds.toFixed(2)} sq yds` },
    { label: "Wetted Area (acres)", value: `${calculations.wetted_area_acres.toFixed(2)} acres` },
    { label: "Wetted Area (gross %)", value: `${calculations.wetted_area_gross_percent.toFixed(2)} %` }
  ];

  return (
    <div className="calculation-data-section">
      <fieldset className="calculation-fieldset">
        <legend className="fieldset-label">Dimensions</legend>
        {dimensionData.map((data) => (
          <div className="display-group" key={data.label}>
            <span className="display-label">{data.label}:</span>
            <span className="display-value">{data.value}</span>
          </div>
        ))}
      </fieldset>
      <fieldset className="calculation-fieldset">
        <legend className="fieldset-label">Earthwork</legend>
        {earthworkData.map((data) => (
          <div className="display-group" key={data.label}>
            <span className="display-label">{data.label}:</span>
            <span className="display-value">{data.value}</span>
          </div>
        ))}
      </fieldset>
      <fieldset className="calculation-fieldset">
        <legend className="fieldset-label">Wetted Area</legend>
        {wettedAreaData.map((data) => (
          <div className="display-group" key={data.label}>
            <span className="display-label">{data.label}:</span>
            <span className="display-value">{data.value}</span>
          </div>
        ))}
      </fieldset>
    </div>
  )
}

const getEngineeringFirms = () => {
  return [
    {name: "Provost and Pritchard", url: "https://provostandpritchard.com/"}
  ];
}

const getOutputCalculations = (formData) => {
  // used for annual capital payment
  const pmt = (rate, nper, pv) => {
    if (rate === 0) return -(pv / nper);
    return (rate * pv) / (1 - Math.pow(1 + rate, -nper));
  }

  // Calculations and values for Outputs Section
  const calculations = getCalculationsData(formData);
  const landCost = formData.ac_pond * formData.land_cost_per_acre;
  const pipelineInletCost = 20000;
  const pipelineCostPerFt = 200;
  const pipelineTotalCost = formData.pipeline_length * pipelineCostPerFt;
  const fencingQty = 0;
  const fencingCostPerFt = 6; // Placeholder value for fencing cost per ft
  const fencingTotalCost = fencingQty * fencingCostPerFt;
  const subtotal = landCost + calculations.total_cost_of_earthwork + pipelineInletCost + pipelineTotalCost + fencingTotalCost;
  const engineeringPercentage = 0.2;
  const engineeringCost = subtotal * engineeringPercentage;
  const totalCostEstimate = subtotal + engineeringCost;
  const annualCapitalPayment = pmt(formData.annual_interest_rate / 100, formData.loan_length, totalCostEstimate);
  const avgAnnualRechargeDepth = formData.infiltration_rate * calculations.wetted_area_acres;
  const [annualEvapLossNotIncluded, setAnnualEvapLossNotIncluded] = useState(30); // Use for user manip later
  const netRecharge = (avgAnnualRechargeDepth * 30 * formData.num_wet_months * (formData.wet_year_freq / 100) * (1 - (annualEvapLossNotIncluded / 100)));
  const annualCapitalCostPerAF = annualCapitalPayment / netRecharge;
  const totalAnnualCostPerAF = annualCapitalCostPerAF + formData.cost_recharge_water + formData.cost_om;
  const netBenefitPerAF = formData.value_stored_water - totalAnnualCostPerAF;
  const ftPerDayToCfs = 1.98
  const rechargeFlowCfs = avgAnnualRechargeDepth / ftPerDayToCfs;


  const outputs = [
    { label: "Land Purchase", 
      quantity: formData.ac_pond, 
      quantity_unit: "acres", 
      unit_cost: formData.land_cost_per_acre, 
      unit_cost_units: "acre",
      cost: landCost, 
      cost_per_acre: formData.land_cost_per_acre 
    },
    { label: "Earthwork",
      quantity: calculations.total_volume_of_earthwork,
      quantity_unit: "cubic yards",
      unit_cost: formData.earthwork_cost_per_cy,
      unit_cost_units: "cubic yard",
      cost: calculations.total_cost_of_earthwork,
      cost_per_acre: (calculations.total_cost_of_earthwork / formData.ac_pond)
    },
    { label: "Pipeline Inlets",
      quantity: 1,
      quantity_unit: "each",
      unit_cost: pipelineInletCost,
      unit_cost_units: "each",
      cost: pipelineInletCost,
      cost_per_acre: (pipelineInletCost / formData.ac_pond)
    },
    { label: "Pipeline (30)",
      quantity: formData.pipeline_length,
      quantity_unit:"feet",
      unit_cost: pipelineCostPerFt,
      unit_cost_units: "foot",
      cost: pipelineTotalCost,
      cost_per_acre: (pipelineTotalCost / formData.ac_pond)
    },
    // Add input variable for fencing 
    { label: "Fencing",
      quantity: 0,
      quantity_unit: "feet",
      unit_cost: fencingCostPerFt,
      unit_cost_units: "foot",
      cost: fencingTotalCost,
      cost_per_acre: (fencingTotalCost / formData.ac_pond)
    },
    // keeping same shape for object to not break table structure
    { label: "Subtotal",
      quantity: null,
      quantity_unit: "",
      unit_cost: null,
      unit_cost_units: "",
      cost: subtotal,
      cost_per_acre: subtotal / formData.ac_pond
    },
    { label: `Engineering and Contingency (${engineeringPercentage * 100}%)`,
      quantity: null,
      quantity_unit: "",
      unit_cost: null,   
      unit_cost_units: "",
      cost: engineeringCost,
      cost_per_acre: engineeringCost / formData.ac_pond
    },
     { label: "Total Cost Estimate",
      quantity: null,
      quantity_unit: "",
      unit_cost: null,
      unit_cost_units: "",
      cost: totalCostEstimate,
      cost_per_acre: totalCostEstimate / formData.ac_pond
     },
     { label: "Annual Capital Payment",
      quantity: null,
      quantity_unit: "",
      unit_cost: annualCapitalPayment,
      unit_cost_units: "year",
      cost: null,
      cost_per_acre: null
     },
     { label: "Average Annual Recharge Depth",
      quantity: avgAnnualRechargeDepth,
      quantity_unit: "feet / day",
      unit_cost: null,
      unit_cost_units: "",
      cost: null,
      cost_per_acre: null
     },
     { label: "Net Recharge (Applied Water - Evaporation Loss)",
      quantity: netRecharge,
      quantity_unit: "acre-feet / year",
      unit_cost: null,
      unit_cost_units: "",
      cost: null,
      cost_per_acre: null
     },
     { label: "Annual Capital Cost per Acre-Foot",
      quantity: null,
      quantity_unit: "",
      unit_cost: annualCapitalCostPerAF,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
     },
     { label: "Water Purchase Cost of Recharge Water",
      quantity: null,
      quantity_unit: "",
      unit_cost: formData.cost_recharge_water,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
     },
     { label: "O&M Cost for Recharge and Basin Maintenance",
      quantity: null,
      quantity_unit: "",
      unit_cost: formData.cost_om,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
     },
     { label: "Total Annual Cost per Acre-Foot of Recharged Water",
      quantity: null,
      quantity_unit: "",
      unit_cost: totalAnnualCostPerAF,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
     },
     { label: "Net Benefit per Acre-Foot",
      quantity: null,
      quantity_unit: "",
      unit_cost: netBenefitPerAF,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
     },
     { label: "Recharge Flow",
      quantity: rechargeFlowCfs,
      quantity_unit: "cfs",
      unit_cost: null,
      unit_cost_units: "",
      cost: null,
      cost_per_acre: null
     }
  ];

  return outputs;
}

function OutputsDataSection({ formData }) {
  const outs = getOutputCalculations(formData);
  
  // helper functions
  const toPrice = (num) => {
    if (num === null) return "-";
    return num.toLocaleString( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  const formatQty = (num) => {
    if (num === null) return "-";
    return num.toFixed(1);
  }

  const formatUnits = (unit) => {
    if (unit === "") return "";
    return ` / ${unit}`;
  }

  // used for annual capital payment
  const pmt = (rate, nper, pv) => {
    if (rate === 0) return -(pv / nper);
    return (rate * pv) / (1 - Math.pow(1 + rate, -nper));
  }

  // Calculations and values for Outputs Section
  const engineeringFirms = getEngineeringFirms();
  const calculations = getCalculationsData(formData);
  const landCost = formData.ac_pond * formData.land_cost_per_acre;
  const pipelineInletCost = 20000;
  const pipelineCostPerFt = 200;
  const pipelineTotalCost = formData.pipeline_length * pipelineCostPerFt;
  const fencingQty = 0;
  const fencingCostPerFt = 6; // Placeholder value for fencing cost per ft
  const fencingTotalCost = fencingQty * fencingCostPerFt;
  const subtotal = landCost + calculations.total_cost_of_earthwork + pipelineInletCost + pipelineTotalCost + fencingTotalCost;
  const engineeringPercentage = 0.2;
  const engineeringCost = subtotal * engineeringPercentage;
  const totalCostEstimate = subtotal + engineeringCost;
  const annualCapitalPayment = pmt(formData.annual_interest_rate / 100, formData.loan_length, totalCostEstimate);
  const avgAnnualRechargeDepth = formData.infiltration_rate * calculations.wetted_area_acres;
  const [annualEvapLossNotIncluded, setAnnualEvapLossNotIncluded] = useState(30); // Use for user manip later
  const netRecharge = (avgAnnualRechargeDepth * 30 * formData.num_wet_months * (formData.wet_year_freq / 100) * (1 - (annualEvapLossNotIncluded / 100)));
  const annualCapitalCostPerAF = annualCapitalPayment / netRecharge;
  const totalAnnualCostPerAF = annualCapitalCostPerAF + formData.cost_recharge_water + formData.cost_om;
  const netBenefitPerAF = formData.value_stored_water - totalAnnualCostPerAF;
  const ftPerDayToCfs = 1.98
  const rechargeFlowCfs = avgAnnualRechargeDepth / ftPerDayToCfs;


  const outputs = [
    { label: "Land Purchase", 
      quantity: formData.ac_pond, 
      quantity_unit: "acres", 
      unit_cost: formData.land_cost_per_acre, 
      unit_cost_units: "acre",
      cost: landCost, 
      cost_per_acre: formData.land_cost_per_acre 
    },
    { label: "Earthwork",
      quantity: calculations.total_volume_of_earthwork,
      quantity_unit: "cubic yards",
      unit_cost: formData.earthwork_cost_per_cy,
      unit_cost_units: "cubic yard",
      cost: calculations.total_cost_of_earthwork,
      cost_per_acre: (calculations.total_cost_of_earthwork / formData.ac_pond)
    },
    { label: "Pipeline Inlets",
      quantity: 1,
      quantity_unit: "each",
      unit_cost: pipelineInletCost,
      unit_cost_units: "each",
      cost: pipelineInletCost,
      cost_per_acre: (pipelineInletCost / formData.ac_pond)
    },
    { label: "Pipeline (30)",
      quantity: formData.pipeline_length,
      quantity_unit:"feet",
      unit_cost: pipelineCostPerFt,
      unit_cost_units: "foot",
      cost: pipelineTotalCost,
      cost_per_acre: (pipelineTotalCost / formData.ac_pond)
    },
    // Add input variable for fencing 
    { label: "Fencing",
      quantity: 0,
      quantity_unit: "feet",
      unit_cost: fencingCostPerFt,
      unit_cost_units: "foot",
      cost: fencingTotalCost,
      cost_per_acre: (fencingTotalCost / formData.ac_pond)
    },
    // keeping same shape for object to not break table structure
    { label: "Subtotal",
      quantity: null,
      quantity_unit: "",
      unit_cost: null,
      unit_cost_units: "",
      cost: subtotal,
      cost_per_acre: subtotal / formData.ac_pond
    },
    { label: `Engineering and Contingency (${engineeringPercentage * 100}%)`,
      quantity: null,
      quantity_unit: "",
      unit_cost: null,   
      unit_cost_units: "",
      cost: engineeringCost,
      cost_per_acre: engineeringCost / formData.ac_pond
    },
     { label: "Total Cost Estimate",
      quantity: null,
      quantity_unit: "",
      unit_cost: null,
      unit_cost_units: "",
      cost: totalCostEstimate,
      cost_per_acre: totalCostEstimate / formData.ac_pond
     },
     { label: "Annual Capital Payment",
      quantity: null,
      quantity_unit: "",
      unit_cost: annualCapitalPayment,
      unit_cost_units: "year",
      cost: null,
      cost_per_acre: null
     },
     { label: "Average Annual Recharge Depth",
      quantity: avgAnnualRechargeDepth,
      quantity_unit: "feet / day",
      unit_cost: null,
      unit_cost_units: "",
      cost: null,
      cost_per_acre: null
     },
     { label: "Net Recharge (Applied Water - Evaporation Loss)",
      quantity: netRecharge,
      quantity_unit: "acre-feet / year",
      unit_cost: null,
      unit_cost_units: "",
      cost: null,
      cost_per_acre: null
     },
     { label: "Annual Capital Cost per Acre-Foot",
      quantity: null,
      quantity_unit: "",
      unit_cost: annualCapitalCostPerAF,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
     },
     { label: "Water Purchase Cost of Recharge Water",
      quantity: null,
      quantity_unit: "",
      unit_cost: formData.cost_recharge_water,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
     },
     { label: "O&M Cost for Recharge and Basin Maintenance",
      quantity: null,
      quantity_unit: "",
      unit_cost: formData.cost_om,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
     },
     { label: "Total Annual Cost per Acre-Foot of Recharged Water",
      quantity: null,
      quantity_unit: "",
      unit_cost: totalAnnualCostPerAF,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
     },
     { label: "Net Benefit per Acre-Foot",
      quantity: null,
      quantity_unit: "",
      unit_cost: netBenefitPerAF,
      unit_cost_units: "acre-foot",
      cost: null,
      cost_per_acre: null
     },
     { label: "Recharge Flow",
      quantity: rechargeFlowCfs,
      quantity_unit: "cfs",
      unit_cost: null,
      unit_cost_units: "",
      cost: null,
      cost_per_acre: null
     }
  ]
  return (
    <div className="outputs-data-section">
      <fieldset className="outputs-fieldset">
        <legend className="fieldset-label">Outputs</legend>
        <table className="outputs-table">
          <thead>
            <tr>
              <th></th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Cost</th>
              <th>Cost per Acre</th>
            </tr>
          </thead>
          <tbody>
            {outputs.map((output) => (
              <tr key={output.label}>
                <th className="outputs-row-title">{output.label}</th>
                <td>{formatQty(output.quantity)} {output.quantity_unit}</td>
                <td>{toPrice(output.unit_cost)}{formatUnits(output.unit_cost_units)}</td>
                <td>{toPrice(output.cost)}</td>
                <td>{toPrice(output.cost_per_acre)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="disclaimer-text">
          <p className="disclaimer-text">Note: this tool provides only a preliminary cost estimate. Recharge basins should be professionally designed to reduce the risk of basin failure. Consult with your water district manager regarding the frequency of availability and cost of recharge water.</p>
          <p>Engineering firms with experience in recharge basin design include:</p>
          <ul>
            {engineeringFirms.map((firm) => (
              <li key={firm.name}><a href={firm.url} target="_blank">{firm.name}</a></li>
            ))}
          </ul>
        </div>
      </fieldset>
    </div>
  )
}

export function RoiResults({ formData }) {
  
  return (
    <div className="roi-results" id="roi-results-section">
      <h2>ROI Results Placeholder</h2>
      <CalculationDataSection formData={formData} />
      <OutputsDataSection formData={formData} />
    </div>
  )
}

export function Footer() {
  const links = [
    { url: "https://www.fresnostate.edu/jcast/cit/", text: "Center for Irrigation Technology (CIT)" },
    { url: "https://www.wetcenter.org/",             text: "Water Energy and Technology Center (WET)" },
    { url: "https://www.californiawater.org/#",      text: "Divison of Reasearch and Education" }
  ]

  const icons = [
    { key: "twitter",  url: "https://twitter.com/FSCWI", icon: "fa-brands fa-x-twitter" },
    { key: "youtube",  url: "https://www.youtube.com/@FSCWI", icon: "fa-brands fa-youtube" },
    { key: "linkedIn", url: "https://www.linkedin.com/company/california-water-institute/", icon: "fa-brands fa-linkedin" }
  ]

  return (
    <footer className="footer has-shadow">
      <div className="footer-container" id="footer-top">
        <div className="footer-card" id="footer-info">
          <h2 className="footer-title">California Water Institute</h2>
          <p className="footer-text">The California Water Institute (CWI) is located at California State University, Fresno and focuses on all aspects of sustainable water resource management solutions through outreach, entrepreneurship, education, testing, and interdisciplinary research.</p>
          <div className="footer-socials">
            { icons.map((icon) => (
              <a href={icon.url} key={icon.key} target="_blank"><div className="footer-icon"><FontAwesomeIcon icon={icon.icon} /></div></a>
            ))}
          </div>
        </div>
        <div className="footer-card">
          <div id="footer-links">
            <h2 className="footer-title">Divisions</h2>
            { links.map((link) => (
              <a href={link.url} key={link.text} target="_blank">{link.text}</a>
            )) }
          </div>
          <a href="https://forms.office.com/pages/responsepage.aspx?id=RKUkUJQ5kUqDx6mSJwGg68X2U3RDDT5OmYMcCswoHoFUNlo2VVpaVUZJNkRFOElHTzdUMTdOWkhFUC4u&route=shorturl" id="footer-button" target="_blank"><Button className="purple-button" text="Subscribe" /></a>
        </div>
      </div>
      <div className="footer-container" id="footer-bottom">
        <p>&copy; Fresno State 2025</p>
      </div>
    </footer>
    )
}

function Button({ className, text }) {
  return <button className={className}>{text}</button>;
}

export function Navbar({setContent}) {
  const handleAboutClick = () => {
    setContent(0);
  };
  
  const handleConceptDesignClick = () => {
    setContent(1);
  };
  
  const handleCalculatorClick = () => {
    setContent(2);
  };

  return (
    <nav className="navbar has-shadow">
        <span className="nav-logo">
          <a href="#"><img src="./src/assets/logo-300x62.png" alt="CWI Logo" className="cwi-logo" /></a>
        </span>
        <span className="nav-links">
          <a onClick={handleAboutClick}>About</a>
          <a onClick={handleConceptDesignClick}>Concept Design</a>
          <a onClick={handleCalculatorClick}>Water Recharge Basin Calculator</a>
        </span>
    </nav>
  )
}

function ProgressBar({ current }) {
  
  const sections = [
    { index: 0, id: "progress-bar-left", text: "Basin Size and Design" },
    { index: 1, id: "progress-bar-center-left", text: "Water Availability" },
    { index: 2, id: "progress-bar-center-right", text: "Development Costs" },
    { index: 3, id: "progress-bar-right", text: "Water Costs" }
  ]

  const isSubmitted = (current > sections.length - 1) ? true : false;

  const sectionColor = (index) => {
    return (
      ( index <= current) ? "progress-bar-fill" : "progress-bar-empty"
    )
  }

  return (
    <div id="progress-bar" className="progress-bar-container">
      {
        sections.map((section) => (
        <span className={`progress-bar ${sectionColor(section.index)}`} id={section.id} key={section.id}>{section.text}</span> 
      ))}
    </div>
  )
}

function BasinSizeAndDesign({ formData, handleChange }) {
  const labels = [
    { text: "Acres of Pond Surface Area", 
      id: "ac_pond", 
      type: "number", 
      min: "0", 
      value: formData.ac_pond, 
      placeholder: "160"
    },
    { text: "Length of Pond (ft)", 
      id: "length_pond", 
      type: "number", 
      min: "0", 
      value: formData.length_pond, 
      placeholder: "2640" 
    },
    { text: "Width of Pond (ft)", 
      id: "width_pond", 
      type: "number", 
      min: "0", 
      value: formData.width_pond, 
      placeholder: "2640" 
    },
    { text: "Inside Slope Ratio (N:1)", 
      id: "inside_slope_ratio", 
      type: "number", 
      min: "0", 
      value: formData.inside_slope_ratio, 
      placeholder: "4" 
    },
    { text: "Outside Slope Ratio (N:1)", 
      id: "outside_slope_ratio", 
      type: "number", 
      min: "0", 
      value: formData.outside_slope_ratio, 
      placeholder: "2" 
    },
    { text: "Levee Width (ft)", 
      id: "levee_width", 
      type: "number", 
      min: "0", 
      value: formData.levee_width, 
      placeholder: "8" 
    },
    { text: "Slope Across Pond (N:1ft)", 
      id: "slope_across_pond", 
      type: "number", 
      min: "0", 
      value: formData.slope_across_pond, 
      placeholder: "0.5", 
      step: "0.1" 
    },
    { text: "Freeboard Depth (ft)", 
      id: "freeboard_depth", 
      type: "number", 
      min: "0", 
      value: formData.freeboard_depth, 
      placeholder: "1" 
    },
    { text: "Water Depth (ft)",
      id: "water_depth", 
      type: "number", 
      min: "0", 
      value: formData.water_depth, 
      placeholder: "1"
    },
    { text: "Infiltration Rate (ft/day)", 
      id: "infiltration_rate", 
      type: "number", 
      min: "0", 
      value: formData.infiltration_rate, 
      placeholder: "0.6" 
    } 
  ]

  const soilOptions = [
    { value: "sand", text: "Sand" },
    { value: "sandy_fine_layering", text: "Sandy with some fine layering" },
    { value: "loam", text: "Loam" },
    { value: "loam_fine_layering", text: "Loam with some fine layering" },
    { value: "silt_clay_loam", text: "Silt or Clay Loam" },
    { value: "silt_clay_loam_fine_layering", text: "Silt or Clay Loam with some fine layering" },
    { value: "clay_restrictive_layers", text: "Clay soil with restrictive layers" }
  ]

  return (
    <fieldset className="form-fieldset">
      <legend className="fieldset-label">Basin Size and Design</legend>
      {labels.map((label) => (
        <div className="input-group" key={label.id}>
          <label htmlFor={label.id}>{label.text}</label>
          <input
            type={label.type}
            id={label.id}
            name={label.id}
            min={label.min}
            value={label.value}
            placeholder={label.placeholder}
            step={label.step}
            onChange={handleChange}
          />
        </div>
      ))}
      <div className="input-group">
        <label htmlFor="soil_type">Soil Type</label>
        <select 
          id="soil_type" 
          name="soil_type" 
          value={formData.soil_type} 
          onChange={handleChange}>
          <option value="" disabled>Select soil type</option>
            {soilOptions.map((option) => (
          <option value={option.value} key={option.value}>{option.text}</option>
          ))}
        </select>
      </div>
    </fieldset>
  )
}

function WaterAvailability({ formData, handleChange }) {
  const labels = [
    { text: "Wet Year Frequency (%)",  
      id: "wet_year_freq", 
      type: "number", 
      min: "0", 
      max: "100", 
      value: formData.wet_year_freq, 
      placeholder: "30" 
    },
    { text: "# of Wet Months Per Year", 
      id: "num_wet_months", 
      type: "number", 
      min: "0", 
      max: "12", 
      value: formData.num_wet_months, 
      placeholder: "4" 
    }
  ]

  return (
    <fieldset className="form-fieldset ">
      <legend className="fieldset-label">Water Availability</legend>
      {labels.map((label) => (
        <div className="input-group" key={label.id}>
          <label htmlFor={label.id}>{label.text}</label>
          <input 
            type={label.type} 
            id={label.id} 
            name={label.id} 
            min={label.min} 
            max={label.max} 
            value={label.value}
            placeholder={label.placeholder}
            step={label.step}
            onChange={handleChange} />
        </div>
      ))}
    </fieldset>
  )
}

function DevelopmentCosts( {formData, handleChange }) {
  const labels = [
    { text: "Land Cost Per Acre" , 
      id: "land_cost_per_acre", 
      type: "number", min: "0", 
      value: formData.land_cost_per_acre, 
      placeholder: "6000" 
    },
    { text: "Total ft of Pipeline", 
      id: "pipeline_length", 
      type: "number", 
      min: "0", 
      value: formData.pipeline_length, 
      placeholder: "2640" 
    },
    { text: "Cost per Cubic Yd of Earthwork", 
      id: "earthwork_cost_per_cy", 
      type: "number", 
      min: "0", 
      value: formData.earthwork_cost_per_cy, 
      placeholder: "12" 
    },
    { text: "Annual Interest Rate (%)",
      id: "annual_interest_rate", 
      type: "number", 
      min: "0", 
      value: formData.annual_interest_rate, 
      placeholder: "5"
    },
    { text: "Length of Loan (Years)", 
      id: "loan_length", 
      type: "number", 
      min: "0", 
      value: formData.loan_length, 
      placeholder: "10" 
    },
  ]

  return (
    <fieldset className="form-fieldset">
      <legend className="fieldset-label">Development Costs</legend>
      {labels.map((label) => (
        <div className="input-group" key={label.id}>
          <label htmlFor={label.id}>{label.text}</label>
          <input 
            type={label.type} 
            id={label.id} 
            name={label.id} 
            min={label.min}
            value={label.value} 
            placeholder={label.placeholder}
            step={label.step}
            onChange={handleChange} />
        </div>
      ))}
    </fieldset>
  )
}

function WaterCosts({ formData, handleChange }) {
  const labels = [
    { text: "Cost of Reacharge Water ($/AF)" , 
      id: "cost_recharge_water", 
      type: "number", 
      min: "0", 
      value: formData.cost_recharge_water, 
      placeholder: "35" 
    },
    { text: "Value of Stored Water ($/AF)", 
      id: "value_stored_water", 
      type: "number", 
      min: "0", 
      value: formData.value_stored_water, 
      placeholder: "200" 
    },
    { text: "Cost of O&M ($/AF)", 
      id: "cost_om", 
      type: "number", 
      min: "0", 
      value: formData.cost_om, 
      placeholder: "5" 
    }
  ]

  return (
    <fieldset className="form-fieldset">
      <legend className="fieldset-label">Water Costs</legend>
      {labels.map((label) => (
        <div className="input-group" key={label.id}>
          <label htmlFor={label.id}>{label.text}</label>
          <input 
            type={label.type} 
            id={label.id} 
            name={label.id} 
            min={label.min} 
            value={label.value}
            placeholder={label.placeholder}
            step={label.step}
            onChange={handleChange} 
          />
        </div>
      ))}
    </fieldset>
  )
}
