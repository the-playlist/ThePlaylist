"use client";
import { useSelector } from "react-redux";
import { SideBar, NavBar } from "../_components";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );
  return (
    <div
      className={`p-4 flex h-screen ${masterViewTheme ? " bg-light" : "bg-dark"}`}
    >
      <SideBar />
      <div className="flex flex-col flex-1">
        <NavBar />
        <div className=" flex-1 mt-2">{children}</div>
      </div>
    </div>
  );
}
