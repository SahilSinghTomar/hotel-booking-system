"use client";

import { ProfilePicture } from "@/components/Profile-picture";
import useCurrentUser from "@/hooks/use-current-user";
import React from "react";

const Dashboard = () => {
  const user = useCurrentUser();

  if (!user) {
    return <div>Not authenticated! Please Login.</div>;
  }

  return (
    <div className="">
      {JSON.stringify(user)}
      <p>
        <ProfilePicture />
      </p>
    </div>
  );
};

export default Dashboard;
