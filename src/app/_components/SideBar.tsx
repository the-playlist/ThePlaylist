"use client";
import Link from "next/link";
import { navlinks } from "./pathname";
import { IoPlaySharp, IoPause } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { HiMusicNote } from "react-icons/hi";

const SideBar = () => {
  const pathname = usePathname();

  return (
    <>
      <div className=" drop-shadow-lg lg:block md:block hidden bg-white relative  rounded-2xl mr-5 w-1/6 ">
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
        <div className=" absolute bottom-0  p-4  w-full ">
          <span className="text-black font-semibold text-lg">Current Song</span>
          <div className="bg-primary rounded-lg mt-2 p-4">
            <div className="flex items-center ">
              <div className="rounded-full p-1 flex items-center justify-center  h-8 w-8   bg-black ">
                <HiMusicNote color="white" size={20} />
              </div>
              <div className="text-black flex flex-col ml-3 ">
                <span className="font-semibold">Imagine </span>
                <span className="font-normal">John Lennon</span>
              </div>
            </div>
            <div className="p-2 mt-5 rounded-full bg-[#F7F7F7] flex justify-center items-center">
              <button className="h-8 w-8 bg-white shadow-xl rounded-full flex items-center justify-center mr-2 ">
                {false ? <IoPause /> : <IoPlaySharp />}
              </button>
              <span>3:15</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
