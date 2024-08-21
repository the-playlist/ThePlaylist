"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "../../svgs";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";
import { CountDown } from "@/app/_components/count-down";
import {
  useLazyGetSongsFromPlaylistQuery,
  useLazyGetThemeByTitleQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { io } from "socket.io-client";
import { CustomLoader } from "@/app/_components/custom_loader";
import { IntroCounter } from "./intro-counter";
import { useFullScreenHandle, FullScreen } from "react-full-screen";
import { useOnlineStatus } from "@/app/_utils/helper";
import { EllipsisText } from "@/app/_components/ellipsis-text";

const PerformerView = () => {
  const isOnline = useOnlineStatus();
  const [getPlaylistSongListApi] = useLazyGetSongsFromPlaylistQuery();
  const [getThemeByTitleApi] = useLazyGetThemeByTitleQuery();
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [performer, setPerformers] = useState([]);
  const [themeMode, setThemeMode] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showCountDown, setShowCountDown] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const handle = useFullScreenHandle();

  let screenName = "Player View";
  useEffect(() => {
    if (isOnline) {
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        autoConnect: false,
      });
      socket.connect();
      fetchPlaylistSongList(null);
    }
  }, [isOnline]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();

    socket.on("insertSongIntoPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });
    socket.on("handleDragRes", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });
    socket.on("bufferTimeRes", (item) => {
      setTimerRunning(false);
      const { time } = item;
      setSeconds(time);
      setTimerRunning(true);
    });

    socket.on("startIntroSecondsResponse", (item) => {
      setShowCountDown(true);
    });
    socket.on("RemoveSongFromPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });
    socket.on("playerViewRes", (item) => {
      const { playlist, isFirst } = item;
      localStorage.setItem("isFirstTimeFetched", isFirst);

      setPerformers([...playlist]);
    });
    socket.on("emptyPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });

    socket.on("undoActionResponse", (item) => {
      const { playlist, isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });
    socket.on("undoFavRes", (item) => {
      const { isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });
    socket.on("songAddByCustomerRes", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });

    socket.on("themeChangeByMasterRes", (item) => {
      const { title } = item;
      if (screenName == title) {
        getThemeByTitleHandler(title);
      }
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
    let timer;
    if (seconds == 0) {
      setShowCountDown(false);
      return;
    }
    if (timerRunning && seconds > 0) {
      timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else {
      setShowCountDown(false);
    }

    return () => clearTimeout(timer);
  }, [seconds, timerRunning]);

  useEffect(() => {
    getThemeByTitleHandler(screenName);
  }, []);

  const fetchPlaylistSongList = async (firstFetch) => {
    let isFirst = localStorage.getItem("isFirstTimeFetched");

    try {
      let response = await getPlaylistSongListApi(firstFetch ?? isFirst);
      if (response && !response.isError) {
        const list = response?.data?.content?.playlist;
        if (list?.length == 0) {
          localStorage.setItem("isFirstTimeFetched", true);
        }
        setPerformers(list);
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

  const listItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    removed: { opacity: 0, y: 20 },
  };

  return (
    <FullScreen handle={handle} className=" overflow-y-auto">
      <div
        className={`${themeMode ? "bg-white" : "bg-[#1F1F1F]"} min-h-screen`}
        ref={ref}
      >
        <div className="overflow-x-auto mx-auto p-10 ">
          {loading ? (
            <CustomLoader bgColor={themeMode ? "bg-[#1F1F1F]" : "bg-white"} />
          ) : (
            <>
              <div className=" float-right">
                <button
                  className="bg-transparent"
                  onClick={() => {
                    if (!isFullScreen) {
                      handle.enter();
                    } else {
                      handle.exit();
                    }
                    setIsFullScreen(!isFullScreen);
                  }}
                >
                  {!isFullScreen ? (
                    <RiFullscreenFill
                      size={30}
                      color={themeMode ? "black" : "white"}
                    />
                  ) : (
                    <MdOutlineFullscreenExit
                      size={40}
                      color={themeMode ? "black" : "white"}
                    />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-center m-5">
                <Logo />
              </div>
              {performer.length === 0 && (
                <div
                  className={`flex items-center justify-center flex-1 min-h-52 font-semibold text-lg ${
                    themeMode ? "text-black" : "text-white"
                  }`}
                >
                  The playlist is empty.
                </div>
              )}

              <table className="table table-lg border-separate border-spacing-y-4 ">
                {performer?.map((item, index) => (
                  <tbody className={`text-base rounded-tl-lg font-medium`}>
                    <tr className="bg-[#1F1F1F]">
                      <div
                        className={`flex flex-row p-3 rounded-lg ${
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
                        {/* <td
                      className={`lg:text-[30px]  text-lg text-start rounded-l-lg `}
                    >
                      {index + 1}
                    </td> */}
                        <td
                          className={`text-[50px] rounded-lg  flex-1  leading-[80px]  capitalize text-left  `}
                        >
                          <EllipsisText
                            className={" text-[50px]  capitalize text-left   "}
                            text={item.title}
                            length={20}
                          />
                        </td>
                        <td
                          className={`text-[35px] leading-[50px]  capitalize text-end flex p-0 items-center `}
                        >
                          <EllipsisText
                            className={"text-[35px]  capitalize text-left   "}
                            text={item.playerName}
                            length={15}
                          />
                        </td>
                        <td className="text-black rounded-r-lg text-end  m-0 p-2 pl-3 flex items-center ">
                          <IntroCounter
                            index={index}
                            performerList={performer}
                            introTimer={parseInt(item?.introSec ?? 0)}
                            showCountDown={showCountDown}
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
    </FullScreen>
  );
};

export default PerformerView;
