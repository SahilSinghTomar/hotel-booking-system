import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Navbar />
      <div className="mt-20 max-w-7xl">{children}</div>
    </div>
  );
}
