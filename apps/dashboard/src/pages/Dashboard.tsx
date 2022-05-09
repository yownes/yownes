import React from "react";

import { useAuth } from "../lib/auth";
import { AdminHeader } from "../components/organisms";
import DashboardTemplate from "../components/templates/Dashboard";

import AdminDashboard from "./admin";
import ClientDashboard from "./client";

const Dashboard = () => {
  const { isAdmin } = useAuth();
  return (
    <DashboardTemplate header={isAdmin ? <AdminHeader /> : null}>
      {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
    </DashboardTemplate>
  );
};

export default Dashboard;
