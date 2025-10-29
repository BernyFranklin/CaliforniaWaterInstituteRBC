import { useState, useCallback } from 'react';
import Button from './Button.jsx';
import CalculatorHeader from './calculator/CalculatorHeader.jsx';
import ProgressBar from './calculator/ProgressBar.jsx';
import ButtonBar from './calculator/ButtonBar.jsx';
import RoiResults from './calculator/RoiResults.jsx';
import FormSection from './forms/FormSection.jsx';
import { usePersistentState } from '../utils/hooks/usePersistentState.js';
import { defaultFormData } from '../utils/form/defaultFormData.js';


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