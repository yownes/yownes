import React from "react";

import { useAuth } from "../lib/auth";

import AdminDashboard from "./admin";
import ClientDashboard from "./client";
import { AdminHeader } from "../components/organisms";
import DashboardTemplate from "../components/templates/Dashboard";

const Dashboard = () => {
  const { isAdmin } = useAuth();
  return (
    <DashboardTemplate header={isAdmin ? <AdminHeader /> : null}>
      {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
    </DashboardTemplate>
  );
};

export default Dashboard;
