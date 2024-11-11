"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "../../svgs";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";
import { CustomLoader } from "@/app/_components/custom_loader";
import {
  useLazyGetSongsFromPlaylistQuery,
  useLazyGetThemeByTitleQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { io } from "socket.io-client";
import { JUMBOTRON_VIEW, WALL_VIEW } from "@/app/_utils/common/constants";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useOnlineStatus } from "@/app/_utils/helper";
import { EllipsisText } from "@/app/_components/ellipsis-text";

const WallView = () => {
  const handle = useFullScreenHandle();

  const [getPlaylistSongListApi] = useLazyGetSongsFromPlaylistQuery();
  const [getThemeByTitleApi] = useLazyGetThemeByTitleQuery();
  const isOnline = useOnlineStatus();
  const [isLoading, setIsLoading] = useState(true);
  const [songList, setSongList] = useState([]);
  const elementRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [themeMode, setThemeMode] = useState(false);
  const [currentActive, setCurrentActive] = useState(null);
  let screenName = "Wall View";

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
    if (typeof window !== "undefined") {
      const getCurrentActiveScreen = localStorage.getItem("currentActive");
      setCurrentActive(getCurrentActiveScreen);
    }
  }, []);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();

    socket.on("wallViewJumbotronResponse", (item) => {
      const { screenName } = item;
      setCurrentActive(screenName);
      localStorage.setItem("currentActive", screenName);
      if (screenName == WALL_VIEW) {
        fetchPlaylistSongList();
      }
    });
    socket.on("insertSongIntoPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      localStorage.setItem("isFirstTimeFetched", isFirst);
      setSongList([...playlist]);
    });
    socket.on("handleDragRes", (item) => {
      const { playlist, isFirst } = item;
      setSongList([...playlist]);
    });
    socket.on("emptyPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      setSongList([...playlist]);
    });

    socket.on("RemoveSongFromPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      setSongList([...playlist]);
    });
    socket.on("wallViewRes", (item) => {
      const { playlist, isFirst } = item;
      localStorage.setItem("isFirstTimeFetched", isFirst);

      setSongList([...playlist]);
    });
    socket.on("undoActionResponse", (item) => {
      const { playlist, isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });
    socket.on("themeChangeByMasterRes", (item) => {
      const { title } = item;
      if (screenName == title) {
        getThemeByTitleHandler(title);
      }
    });
    socket.on("songAddByCustomerRes", (item) => {
      const { playlist, isFirst } = item;
      setSongList([...playlist]);
    });
    socket.on("undoFavRes", (item) => {
      const { isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });
    socket.on("disconnect", async (reason) => {
      socket.disconnect();
      console.log(`Socket disconnected socket connection test: ${reason}`);
      socket.connect();
      await fetchPlaylistSongList(null);
    });
  }, []);

  useEffect(() => {
    const currentActive = localStorage.getItem("currentActive");
    if (currentActive == null && typeof window !== "undefined") {
      setCurrentActive(1);
      localStorage.setItem("currentActive", 1);
    }
    fetchPlaylistSongList();
    getThemeByTitleHandler(screenName);
  }, []);

  const fetchPlaylistSongList = async (firstFetch) => {
    let isFirst = localStorage.getItem("isFirstTimeFetched");

    try {
      let response = await getPlaylistSongListApi(firstFetch ?? isFirst);
      if (response && !response.isError) {
        setSongList(response?.data?.content?.playlist);
        if (response?.data?.content?.playlist?.length == 0) {
          localStorage.setItem("isFirstTimeFetched", true);
        }
      }
      setIsLoading(false);
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

  return (
    <FullScreen handle={handle}>
      <div
        className={`${themeMode ? "bg-white" : "bg-[#1F1F1F]"} min-h-screen`}
      >
        <div className="overflow-x-auto mx-auto ">
          {isLoading ? (
            <CustomLoader bgColor={themeMode ? "bg-[#1F1F1F]" : "bg-white"} />
          ) : (
            <>
              <div
                className={`p-10

                   ${
                     currentActive == WALL_VIEW
                       ? "opacity-100 block"
                       : "opacity-0 hidden"
                   }

              `}
              >
                <div className=" float-right">
                  <button
                    className=" bg-transparent"
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
                <ul>
                  {songList.map((item, index) => (
                    <div
                      key={item?._id}
                      className={`p-2 rounded-lg flex items-center justify-between mb-5 font-medium
              ${
                index < 2
                  ? "bg-yellow-400  text-black  "
                  : `${
                      themeMode
                        ? "bg-[#F0F0F0] text-black"
                        : "bg-[#303134] text-white"
                    }`
              }
              `}
                    >
                      <EllipsisText
                        text={item?.title}
                        length={20}
                        className={`text-[35px]  capitalize  leading-[85px] `}
                      />

                      <EllipsisText
                        text={item?.artist}
                        length={15}
                        className={`text-[23px]  capitalize  flex-1 leading-[85px] text-right  `}
                      />
                    </div>
                  ))}
                </ul>

                {songList?.length == 0 && (
                  <div
                    className={`flex justify-center text-lg items-center h-64 ${
                      themeMode ? "text-black" : "text-white"
                    } w-full`}
                  >
                    The playlist is empty.
                  </div>
                )}
              </div>
              <div
                className={`flex w-full h-[100vh]
                ${
                  currentActive == JUMBOTRON_VIEW
                    ? "opacity-100 block"
                    : "opacity-0 "
                }

            `}
              >
                <iframe
                  src={process.env.NEXT_PUBLIC_JUMBOTRON_URL}
                  className="w-full h-full"
                ></iframe>
              </div>
            </>
          )}
        </div>
      </div>
    </FullScreen>
  );
};

export default WallView;
