"use client";

import { ProfilePicture } from "@/components/Profile-picture";
import { Button } from "@/components/ui/button";
import useCurrentUser from "@/hooks/use-current-user";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  const user = useCurrentUser();

  if (!user) {
    return <div>Not authenticated! Please Login.</div>;
  }

  return (
    <div className="">
      {JSON.stringify(user)}
      <Button>
        <Link href="/host">My Hotels</Link>
      </Button>
    </div>
  );
};

export default Dashboard;
