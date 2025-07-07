import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const SuperAdminRoute = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(null);
  const API_URL2 = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL2}/api/auth-check`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSuperAdmin(data.success && data.user?.role === "super_admin");
      })
      .catch(() => setIsSuperAdmin(false));
  }, []);

  if (isSuperAdmin === null) return <p>Loading...</p>;
  return isSuperAdmin ? <Outlet /> : <Navigate to="/students" replace />;
};

export default SuperAdminRoute; 