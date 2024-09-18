export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen items-start">
      <div className="min-w-full">
        <div className="p-8">
          <div className="border-2 rounded-lg p-12 w-3/4 mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
