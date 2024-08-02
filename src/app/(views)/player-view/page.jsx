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

const PerformerView = () => {
  const [getPlaylistSongListApi] = useLazyGetSongsFromPlaylistQuery();
  const [getThemeByTitleApi] = useLazyGetThemeByTitleQuery();
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [performer, setPerformers] = useState([]);
  const [themeMode, setThemeMode] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const [timerRunning, setTimerRunning] = useState(false);

  let screenName = "Player View";

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

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    let timer;
    if (timerRunning && seconds > 0) {
      timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [seconds, timerRunning]);

  useEffect(() => {
    fetchPlaylistSongList(null);
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
              <button className="bg-transparent" onClick={() => {}}>
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

            <table className="table table-lg border-separate border-spacing-y-2 ">
              {performer?.map((item, index) => (
                <tbody
                  className={`h-20  text-base rounded-tl-lg   font-medium  
              ${
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
                      <IntroCounter
                        introSec={performer[0]?.introSec}
                        index={index}
                        performerList={performer}
                        introTimer={parseInt(item.introSec)}
                      />
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
            {seconds > 0 && (
              <CountDown openModal={seconds > 0} timer={seconds} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PerformerView;
