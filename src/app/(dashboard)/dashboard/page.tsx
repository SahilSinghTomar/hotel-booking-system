"use client";

import useCurrentUser from "@/hooks/use-current-user";
import React from "react";

const Dashboard = () => {
  const user = useCurrentUser();

  if (!user) {
    return <div>Not authenticated! Please Login.</div>;
  }

  return <div className="flex items-center">{JSON.stringify(user)}</div>;
};

export default Dashboard;
