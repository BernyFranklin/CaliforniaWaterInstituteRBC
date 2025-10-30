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
    const rechargeWaterCost = formData.cost_recharge_water;
    const oAndMCost = formData.cost_om;
    const netRecharge = calculations.find(item => item.label === 'Net Recharge (Applied Water - Evaporation Loss)').quantity;
    const storedWaterValue = formData.value_stored_water;

    const initialCost = calculations.find(item => item.label === 'Total Cost Estimate').cost * -1;
    const annualCost = (rechargeWaterCost + oAndMCost) * netRecharge * -1;
    const annualBenefit = storedWaterValue * netRecharge;
    const npv = projectNPV(formData.annual_interest_rate / 100, initialCost, annualCost, loanLength);
    const totalBenefits = projectNPV(formData.annual_interest_rate / 100, 0, annualBenefit, loanLength);
    const annualNetBenefits = annualBenefit - annualCost;
    const totalNetBenefits = projectNPV(formData.annual_interest_rate / 100, initialCost, annualNetBenefits, loanLength);
    const rows = tableRows(loanLength, initialCost, annualCost, annualBenefit);
    const irr = (calculateIRR(loanLength, -initialCost, annualNetBenefits, 0.05)) * 100;

    // Inline styles for standalone component
    const styles = {
        fieldset: {
            borderRadius: '5px',
            border: '3px solid #ccc',
            padding: '1.25rem',
            paddingTop: 0,
            marginTop: 0,
            textAlign: 'left',
            boxSizing: 'border-box',
        },
        legend: {
            fontFamily: 'inherit',
            fontSize: '1.5rem',
            padding: '0.5rem',
        },
        p: {
            margin: '0.5rem 0 1rem 0',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
            textAlign: 'right',
        },
        th: {
            textAlign: 'right',
        },
        thYear: {
            textAlign: 'center',
        },
        td: {
            textAlign: 'right',
            padding: '0.5rem',
            border: 'solid 1px #ccc',
        },
        tdYear: {
            textAlign: 'center',
            padding: '0.5rem',
            border: 'solid 1px #ccc',
        },
        negative: {
            color: '#b1102b',
            fontWeight: 600,
        },
        summary: {
            margin: '2rem auto 0 auto',
            width: '50%',
        },
        displayGroup: {
            display: 'flex',
            textWrap: 'nowrap',
        },
        displayLabel: {
            justifyContent: 'flex-start',
            width: '50%',
            fontWeight: 600,
        },
        displayValue: {
            justifyContent: 'flex-end',
            width: '50%',
            fontWeight: 600,
            textAlign: 'right',
        },
    };

    const valueStyle = (value, base = {}) => (value < 0 ? { ...base, ...styles.negative } : base);

    return (
        <div className="roi-section">
            <fieldset className="calculation-fieldset" id="roi-fieldset" style={styles.fieldset}>
                <legend className="fieldset-label" style={styles.legend}>Return on Investment</legend>
                <p style={styles.p}>Discount Rate: {formData.annual_interest_rate}%</p>
                <table className="roi-table" style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.thYear}>Year</th>
                            <th style={styles.th}>Costs ($)</th>
                            <th style={styles.th}>Benefits ($)</th>
                            <th style={styles.th}>Net Benefits ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td style={styles.tdYear}>{row.year}</td>
                                <td style={{ ...styles.td, ...styles.negative }}>{toPrice(row.costs)}</td>
                                <td style={styles.td}>{toPrice(row.benefits)}</td>
                                <td style={{ ...styles.td, ...valueStyle(row.netBenefit) }}>{toPrice(row.netBenefit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="roi-summary" style={styles.summary}>
                    <div className="display-group" style={styles.displayGroup}>
                        <span className="display-label" style={styles.displayLabel}>Net Present Value (NPV):</span>
                        <span className="display-value" style={valueStyle(npv, styles.displayValue)}>{toPrice(npv)}</span>
                    </div>
                    <div className="display-group" style={styles.displayGroup}>
                        <span className="display-label" style={styles.displayLabel}>Total Benefits over {loanLength} years:</span>
                        <span className="display-value" style={valueStyle(totalBenefits, styles.displayValue)}>{toPrice(totalBenefits)}</span>
                    </div>
                    <div className="display-group" style={styles.displayGroup}>
                        <span className="display-label" style={styles.displayLabel}>Total Net Benefits over {loanLength} years:</span>
                        <span className="display-value" style={valueStyle(totalNetBenefits, styles.displayValue)}>{toPrice(totalNetBenefits)}</span>
                    </div>
                    <div className="display-group" style={styles.displayGroup}>
                        <span className="display-label" style={styles.displayLabel}>Benefit-Cost Ratio:</span>
                        <span className="display-value" style={styles.displayValue}>{(totalBenefits / -npv).toFixed(2)}</span>
                    </div>
                    <div className="display-group" style={styles.displayGroup}>
                        <span className="display-label" style={styles.displayLabel}> Return on Investment:</span>
                        <span className="display-value" style={valueStyle(irr, styles.displayValue)}>{irr.toFixed(2)}%</span>
                    </div>
                </div>
            </fieldset>
        </div>
    );
}