import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome/Welcome";
import Students from "./pages/allStudents/Students";
import LoginPage from "./pages/login/Login";
import Create from "./pages/create/Create";
import CreateAdmin from "./pages/CreateAdmin/CreateAdmin";
import Edit from "./pages/edit/edit";
import ContractContent from "./pages/contractContent/contractContent";
import ProtectedRoute from "./common/protectRoute";
import SuperAdminRoute from "./common/SuperAdminRoute";
// import SendContract from "./pages/sendContract/SendContract";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/loginforadmin" element={<LoginPage />} />
            <Route path="/create" element={<Create />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/students" element={<Students />} />
          <Route element={<SuperAdminRoute />}>
            <Route path="/create-admin" element={<CreateAdmin />} />
            <Route path="/edit-contract-content" element={<ContractContent />} />
            <Route path="/edit-contract/:id" element={<Edit />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
