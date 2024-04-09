"use client";
import React, { useState, useEffect, useRef } from "react";
import { useOrientation } from "react-use";
import { Logo } from "../../svgs";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";

export const toggleFullScreen = (
  elementRef: any,
  isFullScreen: boolean,
  setIsFullScreen: any
) => {
  const element = elementRef.current;
  if (element) {
    if (!isFullScreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  }
};
const WallView = () => {
  const elementRef = useRef<HTMLDivElement>(null);
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
    { id: 0, songName: "Imagine", artistName: "John Lennon" },
    { id: 1, songName: "Born to run", artistName: "Savannah R." },
    { id: 2, songName: "Hey Jude", artistName: "Shawn T." },
    { id: 3, songName: "Respect", artistName: "Alice K." },
    { id: 4, songName: "Hey Ya!", artistName: "Tom M." },
    { id: 5, songName: "Hey Ya!", artistName: "Tom M." },
    { id: 6, songName: "Hey Ya!", artistName: "Tom M." },
  ];
  return (
    <div className="overflow-x-auto mx-auto p-10 bg-white " ref={elementRef}>
      <div className=" float-right">
        <button
          onClick={() => {
            toggleFullScreen(elementRef, isFullScreen, setIsFullScreen);
          }}
        >
          {!isFullScreen ? (
            <RiFullscreenFill size={30} />
          ) : (
            <MdOutlineFullscreenExit size={40} />
          )}
        </button>
      </div>
      <div className="flex items-center justify-center m-5">
        <Logo />
      </div>
      <table className="table table-lg border-separate border-spacing-y-2 ">
        {/* <thead className="text-center">
          <tr className=" text-black  text-base border border-black  ">
            <th className={`${fontSize} text-start`}>Songs</th>
            <th className={`${fontSize} text-end`}>Artist</th>
          </tr>
        </thead> */}
        {performer?.map((item: any, index: number) => (
          <tbody
            className={` h-20 text-black rounded-tl-lg 
              ${
                index < 2
                  ? "bg-yellow-400 font-medium"
                  : "bg-gray-200 font-medium"
              }
              `}
          >
            <tr>
              <td className={`${fontSize} text-start`}>{item?.songName}</td>
              <td className={`${fontSize} text-end`}>{item?.artistName}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default WallView;
