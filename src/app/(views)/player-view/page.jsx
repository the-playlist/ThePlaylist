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
    });
    socket.connect();

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

    socket.on("songAddByCustomerRes-v2", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });

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
      socket.disconnect();
      console.log(`Socket disconnected socket connection test: ${reason}`);
      socket.connect();
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
              <div className="flex items-center justify-center m-5">
                <Logo />
              </div>
              {performer.length === 0 && (
                <div
                  className={`flex items-center justify-center flex-1 min-h-52 font-semibold sm:text-sm text-lg ${
                    themeMode ? "text-black" : "text-white"
                  }`}
                >
                  The playlist is empty.
                </div>
              )}

              <table className="table table-lg border-separate border-spacing-y-4  ">
                {performer?.map((item, index) => (
                  <tbody className={`text-base rounded-tl-lg font-medium`}>
                    <tr className="bg-[#4d4b4b]">
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
                        <td className="text-black rounded-r-lg text-end  m-0 p-2 pl-3 flex items-center ">
                          <IntroCounter
                            index={index}
                            performerList={performer}
                            introTimer={parseInt(item?.introSec ?? 0)}
                          />
                        </td>
                      </div>
                    </tr>
                  </tbody>
                ))}
              </table>
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
