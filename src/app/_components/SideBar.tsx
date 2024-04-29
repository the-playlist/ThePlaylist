"use client";
import Link from "next/link";
import { navlinks } from "./pathname";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="bg-white shadow-xl lg:flex md:flex hidden  rounded-2xl mr-5 w-1/6 ">
        <ul className="p-4 flex-col w-full    ">
          <div className="flex  items-center justify-center">
            <img src="/assets/logo.png" className="h-10  my-5 " />
          </div>
          {navlinks.map((i) => {
            const isActive = pathname?.startsWith(i.href);
            return (
              <Link href={i.href}>
                <li
                  className={`${
                    isActive
                      ? "  bg-[#FEF9EB]  border border-top-queue-bg "
                      : "my-3 "
                  }  hover:cursor-pointer hover:bg-[#FEF9EB] rounded-xl p-4 my-3`}
                >
                  <div className={`   flex justify-start items-center`}>
                    <Image
                      src={i.icon}
                      width={20}
                      height={20}
                      alt="Picture of the author"
                    />
                    <div
                      className={`mx-3 lg:text-base text-sm ${
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
