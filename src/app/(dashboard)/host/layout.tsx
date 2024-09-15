export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <div className="flex h-full">
          <div className="flex-1 p-8">
            <div className="w-1/2 border-2 rounded-lg p-10 mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
