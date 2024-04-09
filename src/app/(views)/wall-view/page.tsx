"use client";
import React from "react";
import { useOrientation } from "react-use";
import { Logo } from "../../svgs";
import "./style.css";
const WallView = () => {
  const { type } = useOrientation();
  const performer = [
    { id: 0, songName: "Imagine", artistName: "John Lennon" },
    { id: 1, songName: "Born to run", artistName: "Savannah R." },
    { id: 2, songName: "Hey Jude", artistName: "Shawn T." },
    { id: 3, songName: "Respect", artistName: "Alice K." },
    { id: 4, songName: "Hey Ya!", artistName: "Tom M." },
    { id: 5, songName: "Hey Ya!", artistName: "Tom M." },
    { id: 6, songName: "Hey Ya!", artistName: "Tom M." },
  ];
  return (
    <div className="overflow-x-auto  mx-auto p-10">
      <div className="flex items-center justify-center m-10">
        <Logo />
      </div>
      <table className="table table-lg border-separate border-spacing-y-2 ">
        <thead className="text-center">
          <tr className=" text-black  text-base border border-black  ">
            <th className="text-3xl text-start">Songs</th>
            <th className="text-3xl text-end">Artist</th>
          </tr>
        </thead>
        {performer?.map((item: any, index: number) => (
          <tbody
            className={` h-20  rounded-tl-lg 
              ${
                index < 2
                  ? "bg-yellow-400 text-white font-medium"
                  : "bg-gray-200 text-black font-medium"
              }
              `}
          >
            <tr>
              <td className="text-3xl text-start">{item?.songName}</td>
              <td className="text-3xl text-end">{item?.artistName}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default WallView;
