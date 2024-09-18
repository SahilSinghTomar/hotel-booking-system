import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const user = await currentUser();

  return (
    <div>
      <h1 className="uppercase text-slate-400 font-semibold">Your Hotels</h1>
      <ul>
        {user?.hotels.map((hotel) => (
          <li key={hotel.id}>
            <div className="flex flex-col border-2 rounded-lg">
              <div className="flex p-4 justify-between">
                <div className="flex gap-5">
                  <Link href={`/host/hotels/${hotel.id}`}>
                    <Image
                      src="https://res.cloudinary.com/dlriuadjv/image/upload/v1726476827/gvoubtwqrpkad0finvrw.webp"
                      alt="Hotel Image"
                      height={300}
                      width={300}
                      className="rounded-lg"
                    />
                  </Link>
                  <div className="flex flex-col justify-between">
                    <h1 className="text-2xl font-bold">
                      <Link href={`/host/hotels/${hotel.id}`}>
                        {hotel.name}
                      </Link>
                    </h1>
                    <p className="font-light text-slate-400">
                      {hotel.state} | {hotel.country}
                    </p>
                    <p>{hotel.phone}</p>
                    <Button variant="link">
                      <Link href={`mailto:${hotel.email}`}>
                        <p>Mail to: {hotel.email}</p>
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg">
                      <Link href={`/host/hotels/${hotel.id}/udpate`}>
                        <p>{hotel?.website || "No website"}</p>
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <Button className="w-full" variant="secondary">
                    <Link href={`/host/hotels/${hotel.id}/edit`}>Edit</Link>
                  </Button>
                  <Button>
                    <Link href={`/host/hotels/${hotel.id}/rooms`}>Rooms</Link>
                  </Button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Button>
        <Link href="/host/hotels/new">Click here to add more hotels</Link>
      </Button>
    </div>
  );
};

export default page;
