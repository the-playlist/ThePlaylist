"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "../../svgs";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";
import { ToggleFullScreen } from "@/app/_components";

const PerformerView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState("text-3xl");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1076) {
        setFontSize("text-3xl");
      } else {
        setFontSize("text-xl");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const performer = [
    { id: 0, songName: "Imagine", artistName: "John Lennon", intro: 20 },
    { id: 1, songName: "Born to run", artistName: "Savannah R.", intro: 15 },
    { id: 2, songName: "Hey Jude", artistName: "Shawn T.", intro: 18 },
    { id: 3, songName: "Respect", artistName: "Alice K.", intro: 16 },
    { id: 4, songName: "Hey Ya!", artistName: "Tom M.", intro: 30 },
    { id: 5, songName: "Hey Ya!", artistName: "Tom M.", intro: 5 },
    { id: 6, songName: "Hey Ya!", artistName: "Tom M.", intro: 10 },
  ];

  return (
    <div className="overflow-x-auto mx-auto p-10 bg-white " ref={ref}>
      <div className=" float-right">
        <button
          onClick={() => {
            ToggleFullScreen(ref, isFullScreen, setIsFullScreen);
          }}
        >
          {!isFullScreen ? (
            <RiFullscreenFill size={30} />
          ) : (
            <MdOutlineFullscreenExit size={40} />
          )}
        </button>
      </div>
      <div className="  flex items-center justify-center m-5">
        <Logo />
      </div>
      <table className="table table-lg border-separate border-spacing-y-2 ">
        {performer?.map((item: any, index: number) => (
          <tbody
            className={`h-20 text-black text-base rounded-tl-lg    
              ${
                index < 2
                  ? "bg-yellow-400 font-medium"
                  : "bg-gray-200 font-medium"
              }`}
          >
            <tr className="rounded-l-lg">
              <td className={`${fontSize} text-start rounded-l-lg`}>
                {index + 1}
              </td>
              <td className={`${fontSize}  text-start`}>{item?.songName}</td>
              <td className={`${fontSize} text-end`}>{item?.artistName}</td>
              <td className="text-black text-3xl rounded-r-lg text-end w-1/12">
                <div className=" h-10 w-10 text-sm bg-white rounded-full justify-center items-center flex float-end ">
                  {item?.intro}
                </div>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default PerformerView;
