import React from "react";

import routes from "../../lib/adminRoutes";
import { Router } from "../../components/organisms";

const AdminDashboard = () => {
  return <Router routes={routes} />;
};

export default AdminDashboard;
