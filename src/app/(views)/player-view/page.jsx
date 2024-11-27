"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "../../svgs";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";

import {
  useLazyGetSongsFromPlaylistQuery,
  useLazyGetSongsFromPlaylistV2Query,
  useLazyGetThemeByTitleQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { io } from "socket.io-client";
import { CustomLoader } from "@/app/_components/custom_loader";
import { IntroCounter } from "./intro-counter";
import Fullscreen from "react-fullscreen-crossbrowser";
import { useOnlineStatus } from "@/app/_utils/helper";

const PerformerView = () => {
  const isOnline = useOnlineStatus();
  const [getPlaylistSongListApi] = useLazyGetSongsFromPlaylistV2Query();
  const [getThemeByTitleApi] = useLazyGetThemeByTitleQuery();
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [performer, setPerformers] = useState([]);
  const [themeMode, setThemeMode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  let screenName = "Player View";
  useEffect(() => {
    if (isOnline) {
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        autoConnect: false,
      });
      socket.connect();
      setTimeout(() => {
        fetchPlaylistSongList(null);
      }, 1000);
    }
  }, [isOnline]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
    });
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true); // Set to green (connected)
    });
    socket.on("insertSongIntoPlaylistResponse-v2", (item) => {
      const { playlist } = item;
      setPerformers([...playlist]);
    });

    socket.on("favoriteSongRes-v2", (item) => {
      const { playlist } = item;
      setPerformers([...playlist]);
    });

    socket.on("playerViewRes-v2", (item) => {
      const { playlist } = item;

      setPerformers([...playlist]);
    });
    socket.on("emptyPlaylistResponse-v2", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });

    socket.on("undoActionResponse-v2", (item) => {
      const { playlist, isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });

    // socket.on("songAddByCustomerRes-v2", (item) => {
    //   const { playlist, isFirst } = item;
    //   setPerformers([...playlist]);
    // });

    socket.on("handleDragRes-v2", (item) => {
      const { playlist } = item;
      setPerformers([...playlist]);
    });

    socket.on("themeChangeByMasterRes-v2", (item) => {
      const { title } = item;
      if (screenName == title) {
        getThemeByTitleHandler(title);
      }
    });
    socket.on("RemoveSongFromPlaylistResponse-v2", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });

    socket.on("disconnect", async (reason) => {
      console.log(`Socket disconnected socket connection test: ${reason}`);
      setIsConnected(false); // Set to red (disconnected)

      await fetchPlaylistSongList(null);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error socket connection test:", error);
    });

    socket.on("reconnect_error", (error) => {
      console.error("Reconnection error socket connection test:", error);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.error(
        "Reconnection Attempt error socket connection test:",
        attempt
      );
    });

    socket.on("connect_timeout", () => {
      console.warn(
        "Connection timed out socket connection test, possibly due to Wi-Fi disconnection."
      );
    });
    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    getThemeByTitleHandler(screenName);
  }, []);

  const fetchPlaylistSongList = async (firstFetch) => {
    try {
      let response = await getPlaylistSongListApi(null);
      if (response && !response.isError) {
        const { isFavortiteListType, isFixedItems, isNotFixed, completeList } =
          response?.data?.content;

        setPerformers(completeList);
      }
      setLoading(false);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const getThemeByTitleHandler = async (title) => {
    let response = await getThemeByTitleApi(title);
    if (response && !response.isError) {
      const { mode } = response?.data?.content;
      setThemeMode(mode);
    }
  };

  const getElipsisText = (text, length) => {
    const truncatedText =
      text?.length > length ? `${text.slice(0, length)}...` : text;
    return truncatedText;
  };

  return (
    <Fullscreen enabled={isFullScreen} onChange={setIsFullScreen}>
      <div
        className={`${
          themeMode ? "bg-white" : "bg-[#1F1F1F]"
        } h-[100vh]  overflow-y-scroll`}
      >
        <div className="overflow-x-auto mx-auto md:p-10 p-3  ">
          {loading ? (
            <CustomLoader bgColor={themeMode ? "bg-[#1F1F1F]" : "bg-white"} />
          ) : (
            <>
              <div className=" flex flex-row gap-3 items-center">
                <div
                  className={` ${isConnected ? "bg-green-700" : "bg-red-700"} h-5 w-5 rounded-full`}
                />
                <span className={themeMode ? "text-black" : "text-white"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="flex items-center justify-center m-5">
                <Logo />
              </div>
              {performer.length === 0 && (
                <div
                  className={`flex items-center justify-center flex-1 min-h-52 font-semibold sm:text-sm text-lg  ${
                    themeMode ? "text-black" : "text-white"
                  }`}
                >
                  The playlist is empty.
                </div>
              )}
              <div className=" flex flex-col gap-5">
                {performer?.map((item, index) => (
                  <div
                    className={`flex items-center justify-between flex-row gap-2 p-3 md:p-11 font-semibold rounded-lg ${
                      index < 2
                        ? "bg-yellow-400 text-black"
                        : `
                    ${
                      themeMode
                        ? "bg-[#F0F0F0] text-black"
                        : "bg-[#303134] text-white"
                    }
                    `
                    }`}
                  >
                    <div className=" w-1/2  text-left capitalize ">
                      <span className="text-base  md:text-[40px] leading-snug     ">
                        {getElipsisText(item.title, 15)}
                      </span>
                    </div>
                    <div className=" ">
                      <span
                        className={
                          "text-base md:text-[35px]  capitalize text-left leading-snug    "
                        }
                      >
                        {getElipsisText(item.playerName, 10)}
                      </span>
                    </div>
                    <div className="">
                      <div
                        className={`bg-[#F7F7F7] rounded-full min-w-32 px-5 py-2 text-black text-center text-2xl`}
                      >
                        {item?.location || item?.introSec}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* <table className="table table-lg border-separate border-spacing-y-4  ">
                {performer?.map((item, index) => (
                  <tbody className={`text-base rounded-tl-lg font-medium`}>
                    <tr className="">
                      <div
                        className={`flex items-center justify-center flex-row md:p-3  rounded-lg ${
                          index < 2
                            ? "bg-yellow-400 text-black"
                            : `
                          ${
                            themeMode
                              ? "bg-[#F0F0F0] text-black"
                              : "bg-[#303134] text-white"
                          }
                          `
                        }`}
                      >
                        <td
                          className={`text-[50px] rounded-lg  flex-1 leading-3  md:leading-[80px]  capitalize text-left  `}
                        >
                          <span
                            className={
                              "text-base  md:text-[50px]  capitalize text-left   "
                            }
                          >
                            {getElipsisText(item.title, 15)}
                          </span>
                        </td>
                        <td
                          className={`  text-[35px] leading-[50px]  capitalize text-end flex p-0 items-center `}
                        >
                          <span
                            className={
                              "text-base md:text-[35px]  capitalize text-left   "
                            }
                          >
                            {getElipsisText(item.playerName, 10)}
                          </span>
                        </td>
                        <td className=" text-black rounded-r-lg text-end  m-0 p-2 pl-3 flex items-center ">
                          <div className={`bg-[#F7F7F7] rounded-3xl px-5 py-2`}>
                            {item?.location || "N/A"}
                          </div>
                        </td>
                      </div>
                    </tr>
                  </tbody>
                ))}
              </table> */}
              {/* {showCountDown && (
                <CountDown openModal={showCountDown} timer={seconds} />
              )} */}
            </>
          )}
        </div>
      </div>
    </Fullscreen>
  );
};

export default PerformerView;
