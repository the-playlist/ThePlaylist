"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "../../svgs";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";
import { CustomLoader, ToggleFullScreen } from "@/app/_components";
import { useLazyGetSongsFromPlaylistQuery } from "@/app/_utils/redux/slice/emptySplitApi";

const PerformerView = () => {
  const [getPlaylistSongListApi, getPlaylistSongListResponse] =
    useLazyGetSongsFromPlaylistQuery();
  const [loading, setLoading] = useState(true);

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

  const [performer, setPerformers] = useState([]);
  useEffect(() => {
    fetchPlaylistSongList();
  }, []);

  const fetchPlaylistSongList = async () => {
    try {
      let response = await getPlaylistSongListApi(null);
      if (response && !response.isError) {
        setPerformers(response?.data?.content?.list);
      }
      setLoading(false);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  return (
    <div className="overflow-x-auto mx-auto p-10 bg-white " ref={ref}>
      {loading ? (
        <CustomLoader />
      ) : (
        <>
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
                  <td className={`${fontSize} capitalize text-start`}>
                    {item?.title}
                  </td>
                  <td className={`${fontSize} capitalize text-end`}>
                    {item?.playerName}
                  </td>
                  <td className="text-black text-3xl rounded-r-lg text-end w-1/12">
                    <div className=" h-10 w-10 text-sm bg-white rounded-full justify-center items-center flex float-end ">
                      {item?.introSec}
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </>
      )}
    </div>
  );
};

export default PerformerView;
