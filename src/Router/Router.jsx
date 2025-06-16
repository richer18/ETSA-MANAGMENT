import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "../components/SignIn/SignIn";

function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default Routers;
