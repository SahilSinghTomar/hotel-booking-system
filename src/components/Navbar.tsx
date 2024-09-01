import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserAccountnav from "./UserAccountnav";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-zinc-50 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="flex items-center justify-between px-5">
        <Link href="/">Logo</Link>
        {session?.user ? (
          <UserAccountnav />
        ) : (
          <Link className={buttonVariants()} href="/api/auth/signin">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
