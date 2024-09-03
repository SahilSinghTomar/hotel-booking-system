import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="border-2 p-10 rounded-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
