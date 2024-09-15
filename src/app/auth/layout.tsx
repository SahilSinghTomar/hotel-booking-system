import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-full flex justify-center items-center">
        <div className="bg-red-500 w-1/2 h-full"></div>
        <div className="w-1/2">
          <div className="flex items-center justify-center">
            <div className="border-2 rounded-lg p-10 min-w-96">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
