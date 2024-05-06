"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { navlinks } from "./pathname";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { signOut } from "next-auth/react";
import { MdLogout } from "react-icons/md";
import { RiMenu2Fill } from "react-icons/ri";

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
  const [isOpen, setIsOpen] = useState(false);

  const screenName = navlinks.filter((item) => pathname.includes(item.href));
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav className="flex justify-between items-center px-5 py-3 drop-shadow bg-white rounded-2xl">
      <div className="flex ">
        <div className="  lg:hidden md:hidden flex  mr-5 items-center  ">
          <ul className=" flex-col w-full text-center   ">
            <div className="relative items-center flex ">
              <button
                className={` text-${
                  isOpen ? "white" : "black"
                }  focus:outline-none`}
                onClick={toggleMenu}
              >
                <RiMenu2Fill size={18} />
              </button>

              <div
                className={`fixed top-0 z-50 left-0  w-full h-screen bg-white text-white transition-transform duration-300 ease-in-out transform ${
                  isOpen ? "translate-y-0" : "-translate-y-full"
                }`}
              >
                <ul className="p-4 flex-col w-full    ">
                  <div className="flex  items-center justify-center">
                    <img src="/assets/logo.png" className="h-10  my-5 " />
                  </div>
                  {navlinks.map((i) => {
                    const isActive = pathname?.startsWith(i.href);
                    return (
                      <li
                        className={`${
                          isActive
                            ? "  bg-[#FEF9EB]  border border-top-queue-bg "
                            : "my-3 "
                        }  hover:cursor-pointer hover:bg-[#FEF9EB] rounded-xl p-4 my-3`}
                      >
                        <Link href={i.href} onClick={toggleMenu}>
                          <div className={`   flex justify-start items-center`}>
                            {i.icon(isActive)}
                            <div
                              className={`ml-3 lg:text-base text-sm ${
                                isActive ? "text-top-queue-bg" : "text-black "
                              }`}
                            >
                              {i.name}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </ul>
        </div>
        <div className="text-black font-bold hover:cursor-pointer">
          {screenName[0]?.name || ""}
        </div>
      </div>

      <MenuOption />
    </nav>
  );
};

export default NavBar;
