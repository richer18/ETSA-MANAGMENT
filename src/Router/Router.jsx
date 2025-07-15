import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Dashboard from "../FRONTEND/Dashboard/Home";
import Login from "../FRONTEND/SignIn/SignIn";

import Cedula from "../FRONTEND/components/ABSTRACT/CEDULA/Cedula";
import GeneralFund from "../FRONTEND/components/ABSTRACT/GF/GeneralFund";
import RealPropertyTax from "../FRONTEND/components/ABSTRACT/RPT/RealPropertyTax";
import TrustFund from "../FRONTEND/components/ABSTRACT/TF/TrustFund";
import Zawde from "../FRONTEND/components/WATERWORKS";

import Calendar from "../FRONTEND/components/CALENDAR/index";

import BusinessCard from "../FRONTEND/components/REPORT/BusinessCard/BusinessCard";
import Esre from "../FRONTEND/components/REPORT/ESRE/esre";
import FullReport from "../FRONTEND/components/REPORT/FullReport/FullReport";
import Rcd from "../FRONTEND/components/REPORT/RCD/rcd";
import RptCard from "../FRONTEND/components/REPORT/RPTCARD/realpropertytax_card";

import BusinessRegistration from "../FRONTEND/components/BUSINESS/BusinessRegistration/BusinessRegistration";
import RenewalForm from "../FRONTEND/components/BUSINESS/BusinessRegistration/components/BRenew";
import BusinessAddress from "../FRONTEND/components/BUSINESS/BusinessRegistration/components/BusinessAdress";
import BusinessOperation from "../FRONTEND/components/BUSINESS/BusinessRegistration/components/BusinessOperation";
import NewForm from "../FRONTEND/components/BUSINESS/BusinessRegistration/components/NewFormWrapper";
import EbikeTrisikad from "../FRONTEND/components/BUSINESS/E-BIKE_TRISIKAD/ebiketrisikad";
import Mch from "../FRONTEND/components/BUSINESS/MCH/mch";
import Collection from "../FRONTEND/components/REPORT/Collection/collection";

function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/my-app" element={<Dashboard />}>
          <Route path="real-property-tax" element={<RealPropertyTax />} />
          <Route path="general-fund" element={<GeneralFund />} />
          <Route path="trust-fund" element={<TrustFund />} />
          <Route path="community-tax-certificate" element={<Cedula />} />

          <Route path="calendar" element={<Calendar />} />
          {/* <Route path="dive-ticket" element={<DiveTicket />} /> */}
          {/* <Route path="cash-ticket" element={<CashTicket />} /> */}

          <Route path="business-card" element={<BusinessCard />} />
          <Route path="rpt-card" element={<RptCard />} />
          <Route path="full-report" element={<FullReport />} />
          <Route path="rcd" element={<Rcd />} />
          <Route path="esre" element={<Esre />} />
          <Route path="collection" element={<Collection />} />

          <Route
            path="business-registration"
            element={<BusinessRegistration />}
          />
          <Route path="mch" element={<Mch />} />
          <Route path="e-bike-trisikad" element={<EbikeTrisikad />} />

          <Route path="new-application" element={<NewForm />} />
          <Route path="renew-application" element={<RenewalForm />} />
          <Route path="business-operation" element={<BusinessOperation />} />
          <Route path="business-address" element={<BusinessAddress />} />

          <Route path="water-works" element={<Zawde />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Routers;
