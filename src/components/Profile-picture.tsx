"use client";

import useCurrentUser from "@/hooks/use-current-user";
import { Drawer } from "vaul";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useRef } from "react";

export const ProfilePicture = ({ children }: { children: React.ReactNode }) => {
  const user = useCurrentUser();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      //   const resizedImage = await resizeImage(file, 100, 100);
      setSelectedFile(URL.createObjectURL(file));
      // Add further logic to upload the file
    }
  };

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button>{children}</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="text-lg mb-4">
                New Profile Photo
              </Drawer.Title>
              <div className="flex items-center space-x-10">
                <Image
                  src={selectedFile || user?.image || ""}
                  alt="Profile Photo"
                  width="100"
                  height="100"
                  className="rounded-lg"
                />

                <Input
                  type="file"
                  ref={inputFileRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          <div className="p-4 bg-zinc-100 border-t border-zinc-200 mt-auto">
            <div className="flex gap-6 justify-end max-w-md mx-auto">
              <Button>Upload</Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
