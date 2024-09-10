"use client";

import ProfileForm from "@/components/form/ProfileForm";
import useCurrentUser from "@/hooks/use-current-user";
import React from "react";

const Profile = () => {
  const user = useCurrentUser();

  return (
    <div>
      <ProfileForm />
    </div>
  );
};

export default Profile;
