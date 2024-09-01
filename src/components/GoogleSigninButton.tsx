import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const GoogleSigninButton = ({ children }: { children: React.ReactNode }) => {
  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "http://localhost:3000/dashboard" });
  };

  return (
    <Button onClick={loginWithGoogle} className="w-full">
      {children}
    </Button>
  );
};

export default GoogleSigninButton;
