import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Dashboard from "../FRONTEND/Dashboard/Home";
import Login from "../FRONTEND/SignIn/SignIn";

import GeneralFund from "../FRONTEND/components/ABSTRACT/GF/GeneralFund";
import RealPropertyTax from "../FRONTEND/components/ABSTRACT/RPT/RealPropertyTax";
import TrustFund from "../FRONTEND/components/ABSTRACT/TF/TrustFund";

function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/my-app" element={<Dashboard />}>
          <Route path="real-property-tax" element={<RealPropertyTax />} />
          <Route path="general-fund" element={<GeneralFund />} />
          <Route path="trust-fund" element={<TrustFund />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Routers;
