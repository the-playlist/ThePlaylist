"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "../../svgs";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";
import { CustomLoader, ToggleFullScreen } from "@/app/_components";
import { useLazyGetSongsFromPlaylistQuery } from "@/app/_utils/redux/slice/emptySplitApi";
import { io } from "socket.io-client";
import { Listener_URL } from "../../_utils/common/constants";

const PerformerView = () => {
  const [getPlaylistSongListApi, getPlaylistSongListResponse] =
    useLazyGetSongsFromPlaylistQuery();
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [performer, setPerformers] = useState([]);

  useEffect(() => {
    const socket = io(Listener_URL, { autoConnect: false });
    socket.connect();

    socket.on("addSongToPlaylistApiResponse", (item) => {
      fetchPlaylistSongList();
    });
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

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
    <div className=" bg-[#1F1F1F] min-h-screen" ref={ref}>
      <div className="overflow-x-auto mx-auto p-10 ">
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
            {performer.length === 0 && (
              <div className="flex items-center justify-center flex-1 min-h-52 font-semibold text-lg">
                The playlist is empty.
              </div>
            )}
            <table className="table table-lg border-separate border-spacing-y-2 ">
              {performer?.map((item, index) => (
                <tbody
                  className={`h-20  text-base rounded-tl-lg   font-medium  
              ${
                index < 2
                  ? "bg-yellow-400 text-black"
                  : "bg-[#303134] text-white"
              }`}
                >
                  <tr className="rounded-l-lg">
                    <td
                      className={`lg:text-3xl text-lg text-start rounded-l-lg`}
                    >
                      {index + 1}
                    </td>
                    <td className={`lg:text-3xl text-lg capitalize text-start`}>
                      {item?.title}
                    </td>
                    <td className={`lg:text-3xl text-lg capitalize text-end`}>
                      {item?.playerName}
                    </td>
                    <td className="text-black rounded-r-lg text-end w-1/12">
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
    </div>
  );
};

export default PerformerView;
