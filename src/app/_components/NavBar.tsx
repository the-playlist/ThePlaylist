import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
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
  );
};

export default NavBar;
