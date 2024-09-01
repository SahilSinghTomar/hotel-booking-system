"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

import { useToast } from "@/hooks/use-toast";

const UserAccountnav = () => {
  const { toast } = useToast();

  const handleSignout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/sign-in",
    });
    toast({
      title: "Success",
      description: "You have successfully signed out",
    });
  };

  return (
    <Button onClick={handleSignout} variant="destructive">
      Sign Out
    </Button>
  );
};

export default UserAccountnav;
