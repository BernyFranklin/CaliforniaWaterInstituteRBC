import { getOutputCalculations } from "../utils/calculations/aggregateCalculations.js"

const tableRows = (lengthOfLoan, initialCost, annualCost, annualBenefit) => {
    const rows = [
        { year: 0, costs: initialCost, benefits: 0, netBenefit: initialCost }
    ];

    for (let i = 1; i <= lengthOfLoan; i++) {
        const obj = {
            year: i,
            costs: annualCost,
            benefits: annualBenefit,
            netBenefit: (annualBenefit + annualCost),   // annualCost is negative
        };
        rows.push(obj);
    }
    return rows;
}

const calculateNPV = (discountRate, cashFlows) => {
    let npv = 0;
    for (let i = 0; i < cashFlows.length; i++) {
        npv += cashFlows[i] / Math.pow(1 + discountRate, i + 1);
    }
    return npv;
}
const projectNPV = (discountRate, initialCost, annualCost, lengthOfLoan) => {
    const cashFlows = Array(lengthOfLoan).fill(annualCost);
    const npv = calculateNPV(discountRate, cashFlows);
    return npv + initialCost;
}

const toPrice = (num) => {
    const absNum = Math.abs(num);
    const convertedNum = absNum.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return (num < 0) ? `(${convertedNum})` : convertedNum;
}

const setClassNameForValue = (value, originalClassName) => {
    return value < 0 ? `${originalClassName} negative-value` : originalClassName;
}

const calculateIRR = (lengthOfLoan, initialCost, annualNetBenefits, guessValue) => {
    const cashFlows = [-initialCost, ...Array(lengthOfLoan - 1).fill(annualNetBenefits)];
    const maxIterations = 1000;
    const tolerance = 1e-6;
    let rate = guessValue;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dNpv = 0;

        for (let j = 0; j < cashFlows.length; j++) {
            npv += cashFlows[j] / Math.pow(1 + rate, j);
            if (j > 0) {
                dNpv -= j * cashFlows[j] / Math.pow(1 + rate, j + 1);
            }
        }

        const newRate = rate - npv / dNpv;
        if (Math.abs(newRate - rate) < tolerance) {
            return newRate;
        }
        
        rate = newRate;
    }

    return NaN;
}


export default function ReturnOnInvestmentTable({ formData }) {
    const calculations = getOutputCalculations(formData);
    
    const loanLength = formData.loan_length;
    let rechargeWaterCost = formData.cost_recharge_water;
    let oAndMCost = formData.cost_om;
    let netRecharge = calculations.find(item => item.label === 'Net Recharge (Applied Water - Evaporation Loss)').quantity;
    let storedWaterValue = formData.value_stored_water;

    const initialCost =  calculations.find(item => item.label === 'Total Cost Estimate').cost * -1;
    const annualCost = (rechargeWaterCost + oAndMCost) * netRecharge * -1;
    const annualBenefit = storedWaterValue * netRecharge;
    const npv = projectNPV(formData.annual_interest_rate / 100, initialCost, annualCost, loanLength);
    const totalBenefits = projectNPV(formData.annual_interest_rate / 100, 0, annualBenefit, loanLength);
    const annualNetBenefits = annualBenefit - annualCost;
    const totalNetBenefits = projectNPV(formData.annual_interest_rate / 100, initialCost, annualNetBenefits, loanLength);
    const rows = tableRows(loanLength, initialCost, annualCost, annualBenefit); 
    const irr = (calculateIRR(loanLength, -initialCost, annualNetBenefits, 0.05)) * 100;

    return (
        <div className="roi-section">
            <fieldset className="calculation-fieldset" id="roi-fieldset">
                <legend className="fieldset-label">Return on Investment</legend>
                <p>Discount Rate: {formData.annual_interest_rate}%</p>
                <table className="roi-table">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Costs ($)</th>
                            <th>Benefits ($)</th>
                            <th>Net Benefits ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td className="year-number">{row.year}</td>
                                <td className="negative-value">{toPrice(row.costs)}</td>
                                <td>{toPrice(row.benefits)}</td>
                                <td className={setClassNameForValue(row.netBenefit, "")}>{toPrice(row.netBenefit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="roi-summary">
                    <div className="display-group">
                        <span className={"display-label"}>Net Present Value (NPV):</span><span className={setClassNameForValue(npv, "display-value")}>{toPrice(npv)}</span>
                    </div>
                    <div className="display-group">
                        <span className="display-label">Total Benefits over {loanLength} years:</span><span className={setClassNameForValue(totalBenefits, "display-value")}>{toPrice(totalBenefits)}</span>
                    </div>
                    <div className="display-group">
                        <span className="display-label">Total Net Benefits over {loanLength} years:</span><span className={setClassNameForValue(totalNetBenefits, "display-value")}>{toPrice(totalNetBenefits)}</span>
                    </div>
                    <div className="display-group">
                        <span className="display-label">Benefit-Cost Ratio:</span><span className={setClassNameForValue((totalBenefits / -npv), "display-value")}>{(totalBenefits / -npv).toFixed(2)}</span>
                    </div>
                    <div className="display-group">
                        <span className="display-label"> Return on Investment:</span>
                        <span className={setClassNameForValue(irr, "display-value")}>{irr.toFixed(2)}%</span>
                    </div>
                </div>
            </fieldset>
        </div>
    );
}