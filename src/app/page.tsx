import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-4xl flex flex-col items-center">
      Home
      <Link className={buttonVariants()} href="/dashboard">
        Go to My Dashboard
      </Link>
    </div>
  );
}
