"use client";
import Link from "next/link";
import { navlinks } from "./pathname";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="bg-white drop-shadow-lg lg:flex md:flex hidden  rounded-2xl mr-5 w-1/6 ">
        <ul className="p-4 flex-col w-full    ">
          <div className="flex  items-center justify-center">
            <Link href={"/players"} className="hover:cursor-pointer">
              <img src="/assets/logo.png" className="h-10  my-5 " />
            </Link>
          </div>
          {navlinks.map((i) => {
            const isActive = pathname?.startsWith(i.href);
            return (
              <Link href={i.href}>
                <li
                  className={`${
                    isActive
                      ? "  bg-[#FEF9EB]  border border-top-queue-bg "
                      : "my-5 "
                  }  hover:cursor-pointer hover:bg-[#FEF9EB] rounded-xl p-4 my-3`}
                >
                  <div className={`   flex justify-start items-center`}>
                    {i.icon(isActive)}
                    <div
                      className={`ml-10 mr-3 m lg:text-base text-sm ${
                        isActive ? "text-top-queue-bg" : "text-black "
                      }`}
                    >
                      {i.name}
                    </div>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default SideBar;
