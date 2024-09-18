import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = ({ params }: any) => {
  return (
    <div>
      <h1>Rooms of your hotel</h1>
      <div>Hotel ID: {params.hotelId}</div>
      <Button>
        <Link href={`/host/hotels/${params.hotedId}/rooms/new`}>
          Click here to add more Rooms
        </Link>
      </Button>
    </div>
  );
};

export default page;
