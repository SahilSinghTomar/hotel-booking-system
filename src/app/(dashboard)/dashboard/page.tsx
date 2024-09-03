import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Not authenticated! Please Login.</div>;
  }

  return (
    <div>This is Dashboard {session.user.username || session.user.name}</div>
  );
};

export default page;
