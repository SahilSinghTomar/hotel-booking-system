import Navbar from "@/components/Navbar";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="h-full flex flex-col justify-center items-center">
        <div className="border-2 p-10 rounded-md min-w-96">{children}</div>
      </div>
    </>
  );
};

export default AuthLayout;
