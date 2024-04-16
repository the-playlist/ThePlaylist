"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { navlinks } from "./pathname";

const NavBar = () => {
  const pathname = usePathname();
  const screenName = navlinks.filter((item) => pathname.includes(item.href));
  return (
<<<<<<< HEAD
    <nav className="flex justify-between items-center px-5 py-3 shadow-md rounded-2xl">
      <Link
        className="text-black font-bold hover:cursor-pointer"
        href={"/players"}
      >
        {screenName[0].name}
      </Link>
      <Link className="bg-red-500 rounded-full" href={"/addTopic"}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgbI78v3a7Q5Tcm1DrdpZ7KEH2-ArooT9qzvFe6cLOYxy4wY-hp6dG-NrJKyv9_n5Hcjs&usqp=CAU"
          alt=""
          height={50}
          width={50}
          className="rounded-full"
        />
      </Link>
    </nav>
=======
    <div>
      <nav className="flex justify-between items-center px-5 py-3 shadow-md rounded-2xl">
        <Link
          className="text-black font-bold hover:cursor-pointer"
          href={"/players"}
        >
          Players
        </Link>
        <Link className="bg-red-500 rounded-full" href={"/addTopic"}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgbI78v3a7Q5Tcm1DrdpZ7KEH2-ArooT9qzvFe6cLOYxy4wY-hp6dG-NrJKyv9_n5Hcjs&usqp=CAU"
            alt=""
            height={50}
            width={50}
            className="rounded-full"
          />
        </Link>
      </nav>
    </div>
>>>>>>> 5044cec1231e456028fdfc8cfad5b89c0ff0c954
  );
};

export default NavBar;
