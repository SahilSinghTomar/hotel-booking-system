import React from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Socials = () => {
  const handleLogin = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div>
      <div className="flex">
        <Button
          onClick={() => {
            handleLogin("google");
          }}
          className="border-2 rounded-md flex items-center cursor-pointer px-4 py-2 w-1/2 justify-center fill-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
            width={20}
            height={20}
          >
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          <span className="ml-2">Google</span>
        </Button>
        <Button
          onClick={() => {
            handleLogin("github");
          }}
          className="border-2 rounded-md flex items-center cursor-pointer w-1/2 justify-center"
        >
          <GitHubLogoIcon height={20} width={20} />
          <span className="ml-2">GitHub</span>
        </Button>
      </div>
    </div>
  );
};

export default Socials;
