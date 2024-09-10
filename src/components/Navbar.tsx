import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { UserAccountNavBar } from "./UserAccountnav";
import { auth } from "@/auth";

const Navbar = async () => {
  const session = await auth();

  return (
    <div className="bg-white py-2 border-b border-s-zinc-200 w-full">
      <div className="flex items-center justify-between px-5">
        <Link className="font-semibold text-xl" href="/">
          Tracky
        </Link>
        {session?.user ? (
          <UserAccountNavBar />
        ) : (
          <Link className={buttonVariants()} href="/auth/signin">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
