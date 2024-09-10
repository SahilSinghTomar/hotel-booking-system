"use client";

import useCurrentUser from "@/hooks/use-current-user";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useCurrentUser();

  const currentPath = usePathname();
  const isActive = (linkPath: string) => currentPath === linkPath;

  const activeLinkStyle = {
    backgroundColor: "blue",
    color: "white",
  };

  return (
    <div className="w-full">
      <div>
        <div className="h-64 flex items-center justify-center">
          <div className="w-1/5 justify-center flex">
            <Image
              src={user?.image || ""}
              alt="Profile Picture"
              className="rounded-lg cursor-pointer"
              width={100}
              height={100}
            />
          </div>
          <div className="w-3/5 items-start text-2xl font-semibold text-slate-400">
            {user?.name}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-1/5 flex justify-center">
            <div className="flex flex-col space-y-4">
              <Link
                href="/profile"
                className={`cursor-pointer rounded-lg px-2 py-3 ${
                  isActive("/profile") ? "text-white bg-blue-500" : ""
                }`}
              >
                Basic Info
              </Link>
              <Link
                href="/profile/account"
                className={`cursor-pointer rounded-lg px-2 py-3 ${
                  isActive("/profile/account") ? "text-white bg-blue-500" : ""
                }`}
              >
                Account
              </Link>
              <Link
                href="/profile/privacy"
                className={`cursor-pointer rounded-lg px-2 py-3 ${
                  isActive("/profile/privacy") ? "text-white bg-blue-500" : ""
                }`}
              >
                Privacy
              </Link>
              <Link
                href="/profile/notifications"
                className={`cursor-pointer rounded-lg px-2 py-3 ${
                  isActive("/profile/notifications")
                    ? "text-white bg-blue-500"
                    : ""
                }`}
              >
                Notifications
              </Link>
              <Link
                href="/profile/billing"
                className={`cursor-pointer rounded-lg px-2 py-3 ${
                  isActive("/profile/billing") ? "text-white bg-blue-500" : ""
                }`}
              >
                Billing
              </Link>
            </div>
          </div>
          <div className="w-3/5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
