import { SideBar, NavBar } from "../_components";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-4 flex h-screen">
      <SideBar />
      <div className="flex flex-col flex-1">
        <NavBar />
        <div className=" flex-1 mt-2">{children}</div>
      </div>
    </div>
  );
}
