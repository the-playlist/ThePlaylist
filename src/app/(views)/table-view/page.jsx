"use client";
import React, { useState, useEffect } from "react";
import { Logo } from "@/app/svgs";
import { FaVideo } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useOnlineStatus } from "@/app/_utils/helper";
import {
  useLazyGetThemeByTitleQuery,
  useLazyGetLimitListQuery,
  useGetTableViewSongsV2Mutation,
  useAddUpdateVoteV2Mutation,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { ScreenLoader } from "@/app/_components";
import { io } from "socket.io-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { CustomLoader } from "@/app/_components/custom_loader";

const TableView = () => {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (isOnline) {
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        autoConnect: false,
      });
      socket.connect();
      fetchPlaylistSongList(null);
    }
  }, [isOnline]);
  let screenName = "Table View";
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableno = searchParams.get("tableno");
  const [getLimitListApi] = useLazyGetLimitListQuery();
  const [getPlaylistSongTableView, { isLoading: getSongsLoader }] =
    useGetTableViewSongsV2Mutation();
  const [getThemeByTitleApi] = useLazyGetThemeByTitleQuery();
  const [votingLimit, setVotingLimit] = useState(null);
  const [queueLimit, setQueueLimit] = useState(0);
  const [performer, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState();
  const [themeMode, setThemeMode] = useState(false);
  const [votingList, setVotingList] = useState(null);
  const [votingLoader, setVotingLoader] = useState(false);
  const [currentActiveStreams, setCurrentActiveStreams] = useState(0);
  const [streamLimit, setStreamLimit] = useState(0);
  const [disableVoteBtn, setDisableVoteBtn] = useState({
    id: null,
    isTrue: null,
  });

  const [songDetail, setSongDetail] = useState({
    title: "",
    playerName: "",
    duration: 0,
    playingState: false,
    id: null,
  });

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
    if (str?.length === 0) return hash;
    for (let i = 0; i < str?.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();
    setSocket(socket);
    socket.on("insertSongIntoPlaylistResponse-v2", (item) => {
      const { playlist, isFirst } = item;

      fetchPlaylistSongList(isFirst);
    });

    socket.on("themeChangeByMasterRes-v2", (item) => {
      const { title } = item;
      if (screenName == title) {
        getThemeByTitleHandler(title);
      }
    });
    socket.on("checkActiveStream", (item) => {
      const { activeStream } = item;

      setCurrentActiveStreams(activeStream || 0);
    });

    socket.on("limitChangeByMasterRes", (item) => {
      getLimitApiHandler();
    });

    socket.on("handleDragRes-v2", (item) => {
      const { playlist, isFirst } = item;
      setVotingList([...playlist]);
    });
    socket.on("undoActionResponse-v2", (item) => {
      const { playlist, isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });
    socket.on("emptyPlaylistResponse-v2", (item) => {
      const { playlist, isFirst } = item;
      setPerformers([...playlist]);
    });
    socket.on("undoFavRes-v2", (item) => {
      const { isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });
    socket.on("RemoveSongFromPlaylistResponse-v2", (item) => {
      const { playlist, isFirst } = item;
      setVotingList(playlist);
    });
    socket.on("songAddByCustomerRes-v2", (item) => {
      const { playlist, isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });

    socket.on("remainingTimeRes-v2", (item) => {
      const { duration, currentSongDetail, playingState } = item;
      setSongDetail({
        title: currentSongDetail?.title,
        playerName: currentSongDetail?.player,
        duration: duration,
        playingState: playingState,
        id: currentSongDetail?.id,
      });
    });

    socket.on("disconnect", async (reason) => {
      console.log(`Socket disconnected socket connection test: ${reason}`);

      await fetchPlaylistSongList(null);
    });
  }, []);

  useEffect(() => {
    fetchPlaylistSongList(null);
    getThemeByTitleHandler(screenName);
    getLimitApiHandler();
  }, []);

  useEffect(() => {
    if (votingList?.length > 0) {
      const updatedList = mergeListsWithTableUpVote(votingList, performer);
      setPerformers([...updatedList]);
    }
  }, [votingList]);

  // Function to merge lists based on tableUpVote
  function mergeListsWithTableUpVote(list1, list2) {
    const tableUpVoteMap = new Map(
      list2.map((item) => [item._id, item.tableUpVote])
    );

    return list1.map((item) => ({
      ...item,
      tableUpVote: tableUpVoteMap.get(item._id),
    }));
  }

  const fetchPlaylistSongList = async (firstFetch) => {
    try {
      const firstTimeFetched = localStorage.getItem("isFirstTimeFetched");
      const deviceId = generateDeviceId();
      let payload = {
        id: deviceId,
        firstFetch: firstFetch ?? firstTimeFetched,
      };
      let response = await getPlaylistSongTableView(payload);

      if (response && !response.isError) {
        const { list } = response?.data?.content || {};

        setPerformers(list || []);
        setVotingLoader(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      window.location.reload();
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
      const { list, activeStream } = response?.data?.content;
      const streamReqLimit = list?.find(
        (item) => item.heading == "Live Stream Limit"
      );
      setCurrentActiveStreams(activeStream || 0);
      const voteLimit = list?.find((item) => item.heading == "Vote Limit");
      const queueLimit = list?.find((item) => item.heading == "Queue Limit");

      setStreamLimit(streamReqLimit?.value || 0);
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
          className=" text-base w-full items-center bg-top-queue-bg  disabled:bg-gray-300 disabled:text-gray-200  text-black font-bold py-3 px-4 rounded-md justify-center"
        >
          <div className="flex items-center justify-center">
            <div className={`rounded-full bg-[#1F1F1F] mr-2 p-1`}>
              <IoAdd size={16} color="white" />
            </div>
            Add a Song
          </div>
        </button>
        <button
          disabled={currentActiveStreams == streamLimit}
          onClick={() => {
            creatStreamUserHandler();
          }}
          className={`ml-4 w-full text-base flex items-center  bg-[#1F1F1F] disabled:bg-gray-300  border border-white   font-bold py-3 px-4 rounded-md justify-center text-white`}
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
      const randomIndex = Math.floor(Math.random() * characterPool?.length);

      randomId += characterPool[randomIndex];
    }

    return randomId;
  }

  function castVote(voteData) {
    socket.emit("voteCastingRequest-v2", voteData);
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
    const [addUpdateVoteAPI] = useAddUpdateVoteV2Mutation();

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
        setDisableVoteBtn({
          id: item?._id,
          isTrue: isTrue,
        });
        return;
      }
      const timeDifference = currentTime - prevVoteTime;
      if (timeDifference > timeLimit) {
        localStorage.setItem("prevVoteTime", currentTime);
        localStorage.setItem("voteCount", 1);
        toggleButton(isTrue);
        setDisableVoteBtn({
          id: item?._id,
          isTrue: isTrue,
        });
      } else {
        if (voteCount < voteCountLimit) {
          localStorage.setItem("voteCount", voteCount + 1);
          toggleButton(isTrue);
          setDisableVoteBtn({
            id: item?._id,
            isTrue: isTrue,
          });
        } else {
          toast.error(votingLimit?.message);
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
      setVotingLoader(true);

      await addUpdateVoteAPI({
        customerId: deviceId,
        songId: item?.songId,
        playlistItemId: item?._id,
        playerId: item?.assignedPlayerId,
        isUpVote: isTrue,
        songDetail: songDetail,
      });

      castVote({
        isFirst: false,
        userId: deviceId,
        playlist: updatedPerformer,
        id: item?._id,
        isIncrement: isTrue,
        isVoted: item?.tableUpVote === 0 ? false : true,
      });
    };

    return (
      <div className="flex mr-5">
        <button
          disabled={
            disableVoteBtn.id == item?._id && disableVoteBtn.isTrue == true
          }
          onClick={() => {
            handleVote(true);
          }}
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
          disabled={
            disableVoteBtn.id == item?._id && disableVoteBtn.isTrue == false
          }
          onClick={() => {
            handleVote(false);
          }}
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
      } h-screen overflow-y-scroll mx-auto   px-5 pt-5 pb-10`}
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
                  key={index}
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
      {votingLoader && <ScreenLoader openModal={votingLoader} />}
    </div>
  );
};

export default TableView;
