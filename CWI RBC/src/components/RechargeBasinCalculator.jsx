import { useState, useCallback } from 'react';
import Button from './Button.jsx';
import CalculationDataSection from './CalculationDataSection.jsx';
import OutputsDataSection from './OutputsDataSection.jsx';
import ReturnOnInvestmentTable from './ReturnOnInvestmentTable.jsx';
import FormSection from './forms/FormSection.jsx';
import { usePersistentState } from '../utils/hooks/usePersistentState.js';
import { defaultFormData } from '../utils/form/defaultFormData.js';

function CalculatorHeader() {
  return (
    <div id="calculator-header">
      <h2>Water Recharge Basin Calculator</h2>
      <p>This calculator is intended to help farmers determine whether a recharge basin on or near their property is worthwhile. This tool provides only a preliminary cost estimate. Recharge basins should be professionally designed to reduce the risk of basin failure. Farmers should consult with your water district manager regarding the frequency of availability and cost of recharge water. At the moment, this calculator is still work in progress, and has been discussed at just one Technical Committee Meeting of the Water Blueprint. At the moment, the calculator assumes one basin on flat land. </p>
    </div>
  )
}

function ProgressBar({ current }) {
  
  const sections = [
    { index: 0, id: "progress-bar-left", text: "Basin Size and Design" },
    { index: 1, id: "progress-bar-center-left", text: "Water Availability" },
    { index: 2, id: "progress-bar-center-right", text: "Development Costs" },
    { index: 3, id: "progress-bar-right", text: "Water Costs" }
  ]

  // removed unused isSubmitted variable

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
    { value: 'sand', text: 'Sand' },
    { value: 'sandy_fine_layering', text: 'Sandy with some fine layering' },
    { value: 'loam', text: 'Loam' },
    { value: 'loam_fine_layering', text: 'Loam with some fine layering' },
    { value: 'silt_clay_loam', text: 'Silt or Clay Loam' },
    { value: 'silt_clay_loam_fine_layering', text: 'Silt or Clay Loam with some fine layering' },
    { value: 'clay_restrictive_layers', text: 'Clay soil with restrictive layers' },
  ];

  const fields = [
    ...labels,
    { text: 'Soil Type', id: 'soil_type', type: 'select', options: soilOptions },
  ];

  return <FormSection legend="Basin Size and Design" fields={fields} formData={formData} onChange={handleChange} />;
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

  return <FormSection legend="Water Availability" fields={labels} formData={formData} onChange={handleChange} />;
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

  return <FormSection legend="Development Costs" fields={labels} formData={formData} onChange={handleChange} />;
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

  return <FormSection legend="Water Costs" fields={labels} formData={formData} onChange={handleChange} />;
}


function RoiResults({ formData }) {
  
  return (
    <>
      <h2 className="results-header">Results</h2>
      <div className="roi-results" id="roi-results-section">
        <CalculationDataSection formData={formData} />
        <OutputsDataSection formData={formData} />
        <ReturnOnInvestmentTable formData={formData} />
      </div>
    </>
  )
}

export default function RechargeBasinCalculator() {
  const [formContent, setFormContent] = useState(0);
  const [formData, setFormData] = usePersistentState('formData', defaultFormData);

  // TO-DO: MAKE A RESET BUTTON THAT CLEARS LOCAL STORAGE AND SETS FORM DATA TO DEFAULT VALUES
  const handleChange = useCallback((e) => {
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
  }, [setFormData])
  
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