import Link from "next/link";
import React from "react";

import Icon from "./icon";
import { DashboardLogo } from "../svgs";

const SideBar = () => {
  return (
    <div className="drawer  w-1/6 bg-yellow-500 shadow-md rounded-2xl mr-5 lg:drawer-open">
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
        <ul className="menu p-4 w-60 text-base-content ">
          <li className="hover:bg-yellow-200 h-12 ">
            <Link href={"/"} className="text-black">
              <DashboardLogo />
              Dashboard
            </Link>
          </li>
          <li className="">
            <Link href={"/players"} className="text-black">
              Players
            </Link>
          </li>
          <li className="">
            <Link href={"/"} className="text-black">
              Songs
            </Link>
          </li>
          <li className="">
            <Link href={"/"} className="text-black">
              Duty
            </Link>
          </li>
          <li className="">
            <Link href={"/"} className="text-black">
              Settings
            </Link>
          </li>
          <li className="">
            <Link href={"/"} className="text-black">
              Playlist
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
