"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { navlinks } from "./pathname";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";

const MenuOption = () => {
  return (
    <Menu
      menuButton={
        <MenuButton className=" w-10 h-10  rounded-full bg-option">
          <div className="bg-red-500 rounded-full cursor-pointer">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgbI78v3a7Q5Tcm1DrdpZ7KEH2-ArooT9qzvFe6cLOYxy4wY-hp6dG-NrJKyv9_n5Hcjs&usqp=CAU"
              alt=""
              height={50}
              width={50}
              className="rounded-full"
            />
          </div>
        </MenuButton>
      }
      transition
    >
      <MenuItem
        onClick={() => {
          signOut({
            callbackUrl: "/login",
            redirect: true,
          });
        }}
      >
        <div>
          <span className=" flex flex-row items-center">
            <MdLogout size={20} />
            Logout
          </span>
        </div>
      </MenuItem>
    </Menu>
  );
};

const NavBar = () => {
  const pathname: any = usePathname();

  const screenName = navlinks.filter((item) => pathname.includes(item.href));

  return (
    <nav className="flex justify-between items-center px-5 py-3 shadow-md rounded-2xl">
      <Link
        className="text-black font-bold hover:cursor-pointer"
        href={"/players"}
      >
        {screenName[0]?.name || ""}
      </Link>
      <MenuOption />
    </nav>
  );
};

export default NavBar;
