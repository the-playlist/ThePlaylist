"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "../../svgs";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";
import { CustomLoader } from "@/app/_components/custom_loader";
import {
  useGetSongsFromPlaylistV2Mutation,
  // useLazyGetSongsFromPlaylistV2Query,
  useLazyGetThemeByTitleQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { io } from "socket.io-client";
import { JUMBOTRON_VIEW, WALL_VIEW } from "@/app/_utils/common/constants";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useOnlineStatus } from "@/app/_utils/helper";
import { EllipsisText } from "@/app/_components/ellipsis-text";

const WallView = () => {
  const handle = useFullScreenHandle();
  const [isConnected, setIsConnected] = useState(false);
  // const [getPlaylistSongListApi] = useLazyGetSongsFromPlaylistV2Query();
  const [getPlaylistSongListApi] = useGetSongsFromPlaylistV2Mutation();
  const [getThemeByTitleApi] = useLazyGetThemeByTitleQuery();
  const isOnline = useOnlineStatus();
  const [isLoading, setIsLoading] = useState(true);
  const [songList, setSongList] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [themeMode, setThemeMode] = useState(false);
  const [currentActive, setCurrentActive] = useState(null);

  let screenName = "Wall View";
  const playlistQueue = useRef([]);
  const isProcessing = useRef(false);
  const processQueue = async () => {
    if (isProcessing.current || playlistQueue.current.length === 0) return;

    isProcessing.current = true;

    while (playlistQueue.current.length > 0) {
      // Take the most recent playlist from the queue
      const latestPlaylist = playlistQueue.current.pop();
      setSongList([...latestPlaylist]);
      await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay to prevent rapid UI updates
    }

    isProcessing.current = false;
  };
  useEffect(() => {
    if (isOnline) {
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        autoConnect: false,
      });
      socket.connect();
      fetchPlaylistSongList(true);
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
      reconnection: true,
      reconnectionAttempts: Infinity,
    });
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true); // Set to green (connected)
    });

    // socket.on("heartbeat", (data) => {
    //   console.log("Heartbeat received from server:", data.message);

    //   // Optionally respond back to the server
    //   socket.emit("heartbeat-ack", { message: "pong" });
    // });
    const handlePlaylistUpdate = (item) => {
      const { playlist } = item;
      playlistQueue.current.push(playlist);
      processQueue();
    };

    socket.on("wallViewJumbotronResponse", (item) => {
      const { screenName } = item;
      setCurrentActive(screenName);
      localStorage.setItem("currentActive", screenName);
      if (screenName == WALL_VIEW) {
        fetchPlaylistSongList();
      }
    });
    socket.on("insertSongIntoPlaylistResponse-v2", handlePlaylistUpdate);
    socket.on("removeRes-v2", handlePlaylistUpdate);

    socket.on("favoriteSongRes-v2", (item) => {
      const { playlist } = item;
      setSongList([...playlist]);
    });
    socket.on("handleDragRes-v2", (item) => {
      const { playlist } = item;
      setSongList([...playlist]);
    });
    socket.on("emptyPlaylistResponse-v2", (item) => {
      const { playlist } = item;
      setSongList([...playlist]);
    });

    socket.on("wallViewRes-v2", (item) => {
      const { playlist } = item;
      setSongList([...playlist]);
    });
    socket.on("undoActionResponse-v2", (item) => {
      const { playlist, isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });
    socket.on("themeChangeByMasterRes-v2", (item) => {
      const { title } = item;
      if (screenName == title) {
        getThemeByTitleHandler(title);
      }
    });
    // socket.on("songAddByCustomerRes-v2", (item) => {
    //   const { playlist, isFirst } = item;
    //   setSongList([...playlist]);
    // });
    socket.on("undoFavRes-v2", (item) => {
      const { isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });
    socket.on("RemoveSongFromPlaylistResponse-v2", (item) => {
      const { playlist, isFirst } = item;
      setSongList([...playlist]);
    });
    socket.on("disconnect", async (reason) => {
      console.log(`Socket disconnected socket connection test: ${reason}`);
      setIsConnected(false); // Set to red (disconnected)

      await fetchPlaylistSongList(null);
    });
    // Clean up the socket connection on unmount
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  useEffect(() => {
    const currentActive = localStorage.getItem("currentActive");
    if (currentActive == null && typeof window !== "undefined") {
      setCurrentActive(1);
      localStorage.setItem("currentActive", 1);
    }

    getThemeByTitleHandler(screenName);
  }, []);

  const fetchPlaylistSongList = async (firstFetch) => {
    try {
      let response = await getPlaylistSongListApi();
      if (response && !response.isError) {
        const { completeList } = response?.data?.content || {};
        setSongList(completeList);
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
                <div className=" flex flex-row gap-3 items-center">
                  <div
                    className={` ${isConnected ? "bg-green-700" : "bg-red-700"} h-5 w-5 rounded-full`}
                  />
                  <span className={themeMode ? "text-black" : "text-white"}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
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
                  {songList?.map((item, index) => {
                    const isLocked = index < 2;

                    return item?.requestToPerform ? (
                      <div
                        key={item?._id}
                        className={`p-2 rounded-lg flex items-center justify-between mb-5 font-medium bg-gray-tile`}
                      >
                        <EllipsisText
                          text={item?.title}
                          length={20}
                          className={`text-[35px]  capitalize  leading-[85px] `}
                        />

                        {!item?.requestToPerform ? (
                          <EllipsisText
                            text={item?.artist}
                            length={15}
                            className={`text-[23px]  capitalize  flex-1 leading-[85px] text-right  `}
                          />
                        ) : (
                          <div
                            className={`w-1/2 flex justify-end  capitalize text-[23px]`}
                          >
                            <div
                              className={` ${themeMode ? "bg-[#F7F7F7]  text-black" : "bg-black text-white"} font-semibold  rounded-3xl px-3 py-1 `}
                            >{`Table ${item?.tableNo}`}</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        key={item?._id}
                        className={`p-2 rounded-lg flex items-center justify-between mb-5 font-medium
              ${
                index < 2
                  ? "bg-top-queue-bg  text-black  "
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

                        {!item?.requestToPerform ? (
                          <EllipsisText
                            text={item?.artist}
                            length={15}
                            className={`text-[23px]  capitalize  flex-1 leading-[85px] text-right  `}
                          />
                        ) : (
                          <div
                            className={`w-1/2 flex justify-end  capitalize text-[23px]`}
                          >
                            <div
                              className={` ${themeMode ? "bg-[#F7F7F7]  text-black" : "bg-black text-white"} font-semibold  rounded-3xl px-3 py-1 `}
                            >{`Table ${item?.tableNo}`}</div>
                          </div>
                        )}
                      </div>
                    );

                    // item?.requestToPerform ? (
                    //   <div
                    //     className={` ${isLocked ? "bg-top-queue-bg" : " bg-gray-tile"} p-2 rounded-lg flex items-center justify-between mb-5 font-medium`}
                    //     key={index}
                    //   >
                    //     <div className="w-1/2  text-start flex items-center ">
                    //       <EllipsisText
                    //         text={item?.title}
                    //         length={20}
                    //         className={`text-[35px]  capitalize  leading-[85px] `}
                    //       />
                    //     </div>
                    //     <div
                    //       className={`w-1/2 flex justify-end  capitalize text-[23px]`}
                    //     >
                    //       <div
                    //         className={` ${themeMode ? "bg-[#F7F7F7]  text-black" : "bg-black text-white"} font-semibold  rounded-3xl px-3 py-1 `}
                    //       >{`Table ${item?.tableNo}`}</div>
                    //     </div>
                    //   </div>
                    // ) :
                  })}
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
