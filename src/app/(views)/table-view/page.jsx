"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "@/app/svgs";
import { FaVideo } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import {
  useAddUpdateVoteMutation,
  useLazyGetThemeByTitleQuery,
  useLazyGetLimitListQuery,
  useGetTableViewSongsMutation,
  useLazyGetIsPlaylistEmptyQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { CustomLoader } from "@/app/_components";
import { io } from "socket.io-client";
import { Listener_URL } from "../../_utils/common/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const TableView = () => {
  let screenName = "Table View";
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableno = searchParams.get("tableno");
  const [getLimitListApi] = useLazyGetLimitListQuery();
  const [getIsPlaylistEmptyApi] = useLazyGetIsPlaylistEmptyQuery();
  const [getPlaylistSongTableView] = useGetTableViewSongsMutation();
  const [getThemeByTitleApi] = useLazyGetThemeByTitleQuery();
  const [votingLimit, setVotingLimit] = useState(null);
  const [queueLimit, setQueueLimit] = useState(0);
  const [performer, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState();
  const [themeMode, setThemeMode] = useState(false);

  function generateDeviceId() {
    const combinedId =
      navigator.userAgent +
      window.screen.width +
      window.screen.height +
      Math.floor(Math.random() * (100 - 1 + 1)) +
      1;

    const hashedId = hash(combinedId);
    const ID = localStorage.getItem("UNIQUE_ID");
    if (!ID) {
      localStorage.setItem("UNIQUE_ID", hashedId);
      return hashedId;
    } else {
      return ID;
    }
  }

  function hash(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }

  useEffect(() => {
    const socket = io(Listener_URL, { autoConnect: false });
    socket.connect();
    setSocket(socket);
    socket.on("insertSongIntoPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });
    socket.on("voteCastingResponse", (item) => {
      const { playlist, isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });

    socket.on("themeChangeByMasterRes", (item) => {
      const { title } = item;
      if (screenName == title) {
        getThemeByTitleHandler(title);
      }
    });
    socket.on("limitChangeByMasterRes", (item) => {
      getLimitApiHandler();
    });
    socket.on("RemoveSongFromPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });

    socket.on("emptyPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchIsPlaylistEmpty();
    getThemeByTitleHandler(screenName);
    getLimitApiHandler();
  }, []);

  const fetchIsPlaylistEmpty = async () => {
    let response = await getIsPlaylistEmptyApi();
    if (response && !response.isError) {
      const firstFetch = response?.data?.content?.isFirstTimeFetched;
      fetchPlaylistSongList(firstFetch);
    }
  };

  const fetchPlaylistSongList = async (firstFetch) => {
    let isFirst = localStorage.getItem("isFirstTimeFetched");
    isFirst = Boolean(isFirst);

    try {
      const deviceId = generateDeviceId();
      let payload = {
        id: deviceId,
        isFirstTimeFetched: firstFetch ?? isFirst,
      };

      let response = await getPlaylistSongTableView(payload);
      if (response && !response.isError) {
        const { list, isFirstTimeFetched } = response?.data?.content;
        setPerformers(list || []);
        if (list?.length == 0) {
          localStorage.setItem("isFirstTimeFetched", true);
        }
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

  const getLimitApiHandler = async () => {
    let response = await getLimitListApi();
    if (response && !response.isError) {
      const voteLimit = response?.data?.content.find(
        (item) => item.heading == "Vote Limit"
      );
      const queueLimit = response?.data?.content.find(
        (item) => item.heading == "Queue Limit"
      );

      // const queueLimit = response?.data?.content[2]?.value;
      // const voteLimit = response?.data?.content[1];

      setQueueLimit(queueLimit || 0);
      setVotingLimit(voteLimit);
    }
  };

  const ButtonsAtEnd = ({}) => {
    return (
      <div
        className={`fixed bottom-0 left-0 w-full ${
          themeMode ? "bg-white" : "bg-[#1F1F1F]"
        } flex justify-end p-4`}
      >
        <button
          onClick={() => {
            router.push("/add-song");
          }}
          className=" text-base w-full items-center bg-top-queue-bg hover:cursor-pointer disabled:bg-gray-300 disabled:text-gray-200 hover:bg-yellow-500 hover:text-black text-black font-bold py-3 px-4 rounded-md justify-center"
        >
          <div className="flex items-center justify-center">
            <div className={`rounded-full bg-[#1F1F1F] mr-2 p-1`}>
              <IoAdd size={16} color="white" />
            </div>
            Add a Song
          </div>
        </button>
        <button
          onClick={() => {
            creatStreamUserHandler();
          }}
          className="ml-4 w-full text-base flex items-center  bg-[#1F1F1F]  border border-white   font-bold py-3 px-4 rounded-md justify-center text-white hover:bg-gray-400"
        >
          <FaVideo size={16} className="mr-2" /> Live Video
        </button>
      </div>
    );
  };
  function generateRandomStreamId(length = 12) {
    const characterPool =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let randomId = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);

      randomId += characterPool[randomIndex];
    }

    return randomId;
  }

  const creatStreamUserHandler = async () => {
    let payload = {
      user_id: generateRandomStreamId(8),
      callId: generateRandomStreamId(),
      tableno: tableno,
    };
    const queryString = new URLSearchParams(payload).toString();
    const url = `/live-stream?${queryString}`;
    router.push(url);
  };

  const ActionButtons = ({ index, item }) => {
    const [addUpdateVoteAPI] = useAddUpdateVoteMutation();

    const handleVote = (isTrue) => {
      localStorage.setItem("isFirstTimeFetched", false);
      const currentTime = new Date().getTime();
      const prevVoteTime = parseInt(localStorage.getItem("prevVoteTime"), 10);
      const voteCount = parseInt(localStorage.getItem("voteCount"), 10) || 0;
      const timeLimit = votingLimit?.time * 60000;
      const voteCountLimit = votingLimit?.value;

      if (!prevVoteTime) {
        localStorage.setItem("prevVoteTime", currentTime);
        localStorage.setItem("voteCount", 1);
        toggleButton(isTrue);
        return;
      }
      const timeDifference = currentTime - prevVoteTime;
      if (timeDifference > timeLimit) {
        localStorage.setItem("prevVoteTime", currentTime);
        localStorage.setItem("voteCount", 1);
        toggleButton(isTrue);
      } else {
        if (voteCount < voteCountLimit) {
          localStorage.setItem("voteCount", voteCount + 1);
          toggleButton(isTrue);
        } else {
          toast.error("Vote limit reached. Please try again later.");
        }
      }
    };

    const toggleButton = async (isTrue) => {
      const deviceId = generateDeviceId();
      let updatedPerformer = [...performer];
      let updatedItem = { ...updatedPerformer[index] };
      updatedItem.tableUpVote = isTrue;
      updatedPerformer[index] = updatedItem;
      setPerformers(updatedPerformer);

      await addUpdateVoteAPI({
        customerId: deviceId,
        songId: item?.songId,
        playlistItemId: item?._id,
        playerId: item?.assignedPlayerId,
        isUpVote: isTrue,
      });

      socket.emit("voteCastingRequest", {
        isFirst: false,
        playlist: updatedPerformer,
      });
      // socket.emit("votingRequest", {
      //   customerId: deviceId,
      //   songId: item?.songId,
      //   playlistItemId: item?._id,
      //   playerId: item?.assignedPlayerId,
      //   isUpVote: isTrue,
      //   isFirst: false,
      // });
    };

    return (
      <div className="flex mr-5">
        <button
          onClick={() => handleVote(true)}
          className={`flex items-center justify-center rounded-full shadow-xl w-7 h-7  ${
            item?.tableUpVote == true
              ? "bg-green-500"
              : themeMode
              ? "bg-white"
              : "bg-[#3A3B3E]"
          }`}
        >
          <IoIosArrowUp size={18} color={themeMode ? "black" : "white"} />
        </button>
        <button
          onClick={() => handleVote(false)}
          className={`flex items-center justify-center rounded-full shadow-xl w-7 h-7  ${
            item?.tableUpVote === false
              ? "bg-red-500"
              : themeMode
              ? "bg-white"
              : "bg-[#3A3B3E]"
          } ml-2`}
        >
          <IoIosArrowDown size={18} color={themeMode ? "black" : "white"} />
        </button>
      </div>
    );
  };

  return (
    <div
      className={`overflow-x-auto ${
        themeMode ? "bg-white" : "bg-[#1F1F1F]"
      } h-screen overflow-y-scroll mx-auto   px-5 pt-5`}
    >
      {loading ? (
        <CustomLoader bgColor={themeMode ? "bg-[#1F1F1F]" : "bg-white"} />
      ) : (
        <>
          <div className=" flex items-center justify-center m-5">
            <Logo />
          </div>
          <div className="mb-32">
            {performer?.length === 0 && (
              <div
                className={`flex items-center ${
                  themeMode ? "text-black" : "text-white"
                } justify-center flex-1 mt-20 font-semibold text-lg`}
              >
                The playlist is empty.
              </div>
            )}
            {performer?.map((item, index) => {
              return (
                <div
                  className={`flex  ${
                    index < 2 ? "bg-top-queue-bg" : ""
                  } rounded-md flex-wrap my-2`}
                >
                  <div className="w-1/2  text-start flex items-center">
                    {index < 2 ? (
                      <p className="mx-5 font-extrabold text-lg  ">{`${
                        index < 2 ? index + 1 : ""
                      }`}</p>
                    ) : (
                      <ActionButtons key={index} index={index} item={item} />
                    )}
                    <p
                      className={`font-semibold capitalize ${
                        index < 2
                          ? "text-black"
                          : themeMode
                          ? "text-black"
                          : "text-white"
                      }  text-sm lg:text-lg`}
                    >
                      {item?.title}
                    </p>
                  </div>
                  <div
                    className={`w-1/2 p-4 text-end capitalize ${
                      index < 2
                        ? "text-black"
                        : themeMode
                        ? "text-black"
                        : "text-white"
                    } text-sm lg:text-lg`}
                  >
                    {item?.artist}
                  </div>
                </div>
              );
            })}
            <ButtonsAtEnd />
          </div>
        </>
      )}
    </div>
  );
};

export default TableView;
