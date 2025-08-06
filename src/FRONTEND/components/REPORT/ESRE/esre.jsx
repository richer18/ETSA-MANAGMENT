import { useState } from "react";
import RealPropertyTaxAgricultural from "./component/RealPropertyTaxAgricultural";
import RealPropertyTaxResidential from "./component/RealPropertyTaxResidential";

import RegulatoryFeesAndCharges from "./component//RegulatoryFeeAndChargesDialogContent.js";
import EconomicEnterprise from "./component/ReceiptsFromEconomicEnterprisesDialogContent.js";
import ServiceUserCharges from "./component/ServiceUserChargesDialogContent.js";
import TaxOnBusiness from "./component/TaxOnBusinessDialogContent.js";
// import more components here as you build them

const REPORT_TYPES = [
  "Real Property Tax - Agricultural",
  "Real Property Tax - Residential",
  "Tax on Business",
  "Receipt from Economic Enterprise",
  "Service/User Charges",
  "Regulatory Fees and Charges",
];

const QUARTER_LABELS = {
  "First Quarter Report": "Q1 - Jan, Feb, Mar",
  "Second Quarter Report": "Q2 - Apr, May, Jun",
  "Third Quarter Report": "Q3 - Jul, Aug, Sep",
  "Fourth Quarter Report": "Q4 - Oct, Nov, Dec",
};

// 🔁 Component selector
const getReportComponent = (type, quarter, year) => {
  switch (type) {
    case "Real Property Tax - Agricultural":
      return <RealPropertyTaxAgricultural quarter={quarter} year={year} />;
    case "Real Property Tax - Residential":
      return <RealPropertyTaxResidential quarter={quarter} year={year} />;
    case "Tax on Business":
      return <TaxOnBusiness quarter={quarter} year={year} />;
    case "Receipt from Economic Enterprise":
      return <EconomicEnterprise quarter={quarter} year={year} />;
    case "Service/User Charges":
      return <ServiceUserCharges quarter={quarter} year={year} />;
    case "Regulatory Fees and Charges":
      return <RegulatoryFeesAndCharges quarter={quarter} year={year} />;
    default:
      return null;
  }
};

function Esre() {
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const resolvedQuarter = QUARTER_LABELS[selectedQuarter];

  const handleReportChange = (e) => setSelectedReport(e.target.value);
  const handleQuarterChange = (e) => setSelectedQuarter(e.target.value);

  return (
    <div style={{ padding: 20 }}>
      <h2>ESRE Report Viewer</h2>

      {/* Report Type Dropdown */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 10 }}>Type of Reports:</label>
        <select value={selectedReport} onChange={handleReportChange}>
          <option value="">-- Select Report Type --</option>
          {REPORT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Quarter Dropdown */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ marginRight: 10 }}>Quarter:</label>
        <select value={selectedQuarter} onChange={handleQuarterChange}>
          <option value="">-- Select Quarter --</option>
          {Object.keys(QUARTER_LABELS).map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Render the appropriate component */}
      {selectedReport && resolvedQuarter ? (
        <>
          <h3>{selectedReport}</h3>
          {getReportComponent(selectedReport, resolvedQuarter, "2025")}
        </>
      ) : (
        <p style={{ color: "#777" }}>
          Please select both a report type and a quarter.
        </p>
      )}
    </div>
  );
}

export default Esre;
