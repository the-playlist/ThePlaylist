"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "../../svgs";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";
import { ToggleFullScreen } from "@/app/_components";
import { CustomLoader } from "@/app/_components";
import { useLazyGetSongsFromPlaylistQuery } from "@/app/_utils/redux/slice/emptySplitApi";

const WallView = () => {
  const [getPlaylistSongListApi, getPlaylistSongListResponse] =
    useLazyGetSongsFromPlaylistQuery();
  const [songList, setSongList] = useState([]);

  const elementRef = useRef(null);
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

  useEffect(() => {
    fetchPlaylistSongList();
  }, []);

  const fetchPlaylistSongList = async () => {
    try {
      let response = await getPlaylistSongListApi(null);
      if (response && !response.isError) {
        setSongList(response?.data?.content);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  return (
    <div className="overflow-x-auto mx-auto p-10 bg-white " ref={elementRef}>
      {getPlaylistSongListResponse?.isFetching ? (
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
            {songList?.map((item, index) => (
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
                  <td className={`${fontSize} text-start rounded-l-lg `}>
                    {item?.title}
                  </td>
                  <td className={`${fontSize} text-end rounded-r-lg`}>
                    {item?.artist}
                  </td>
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
