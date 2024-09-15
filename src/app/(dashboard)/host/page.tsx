import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import Link from "next/link";
import React from "react";

const page = async () => {
  const user = await currentUser();

  return (
    <div>
      <h1>Your Hotels</h1>
      <Button>
        <Link href="/host/hotels/new">Click here to add more hotels</Link>
      </Button>
    </div>
  );
};

export default page;
