"use client";
import Link from "next/link";
import React from "react";

import Icon from "./icon";
import { DashboardLogo } from "../svgs";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const navlinks = [
    {
      name: "Dashboard",
      href: "/dashbard",
      icon: "/dashboard.svg",
    },
    {
      name: "Players",
      href: "/players",
      icon: "/player-logo.svg",
    },
    {
      name: "Songs",
      href: "/songs",
      icon: "/song.svg",
    },
    {
      name: "Duty",
      href: "/duty",
      icon: "/duty-icon.svg",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "/setting.svg",
    },
    {
      name: "Playlist",
      href: "/playlist",
      icon: "/playlist.svg",
    },
  ];
  const pathname = usePathname();
  return (
    <div className="drawer  w-1/6  shadow-xl rounded-2xl mr-5 lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content  flex flex-col items-center ">
        <label htmlFor="my-drawer-2" className="btn  drawer-button lg:hidden">
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </label>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu p-4  text-base-content ">
          <div className="flex items-start  justify-center flex-1">
            <img src="/assets/logo.png" className="h-6 w-100 my-2 " />
          </div>

          {navlinks.map((i) => {
            const isActive = pathname?.startsWith(i.href);
            return (
              <li className={isActive ? "rounded  bg-primary my-3" : "my-3"}>
                <Link href={i.href} className="text-black">
                  <Image
                    src={i.icon}
                    className="mr-2  cursor-pointer"
                    width={20}
                    height={20}
                    alt="Picture of the author"
                  />
                  {i.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
