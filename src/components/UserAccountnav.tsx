"use client";

import { signOut, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const UserAccountnav = () => {
  const { toast } = useToast();
  const session = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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
    <div className="relative flex">
      <div onMouseEnter={() => setDropdownOpen(true)} className="relative">
        {session.status === "loading" ? (
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
        ) : (
          <Image
            src={session.data?.user.image!}
            alt="Profile Photo"
            height={40}
            width={40}
            className="rounded-full cursor-pointer object-cover"
          />
        )}
        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </Link>
            <button
              onClick={handleSignout}
              className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccountnav;
