"use client";
import React, { useState, useEffect, useRef } from "react";
import { useOrientation } from "react-use";
import { Logo } from "../../svgs";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";
import { ToggleFullScreen } from "@/app/_components";
import { useLazyGetOnDutyPlayerSongListQuery } from "@/app/_utils/redux/slice/emptySplitApi";
import { CustomLoader } from "@/app/_components";

const WallView = () => {
  const [songsListApi, songsListResponse] =
    useLazyGetOnDutyPlayerSongListQuery();
  const [songList, setSongList] = useState([]);

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
  useEffect(() => {
    fetchSongsList();
  }, []);

  const fetchSongsList = async () => {
    let response = await songsListApi();
    if (response && !response.isError) {
      const songList = response.data?.content;
      setSongList(songList);
    }
  };
  return (
    <div className="overflow-x-auto mx-auto p-10 bg-white " ref={elementRef}>
      {songsListResponse?.isFetching ? (
        <CustomLoader />
      ) : (
        <>
          <div className=" float-right">
            <button
              onClick={() => {
                ToggleFullScreen(elementRef, isFullScreen, setIsFullScreen);
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
            {songList?.map((item: any, index: number) => (
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
                  <td className={`${fontSize} text-start`}>{item?.title}</td>
                  <td className={`${fontSize} text-end`}>{item?.artist}</td>
                </tr>
              </tbody>
            ))}
          </table>
          {songList?.length == 0 && (
            <div className="flex justify-center text-lg items-center h-64 text-black w-full">
              No Songs Found
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WallView;
