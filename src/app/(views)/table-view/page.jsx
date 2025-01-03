"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo, RequestToPerfromIcon } from "@/app/svgs";
import { FaQuestion } from "react-icons/fa";
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
import AddSongIcon from "@/app/svgs/addSong";
import LiveVideoIcon from "@/app/svgs/liveVideo";
import { GenericButton } from "../../_components";

const TableView = () => {
  const popUpRef = useRef(null);
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
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    if (showModal) {
      popUpRef?.current?.showModal();
    } else {
      popUpRef?.current?.close();
    }
  }, [showModal]);

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

  const navigateToAddSong = (request_perform) => {
    let payload = {
      request_perform: request_perform,
      table_no: tableno,
    };
    const queryString = new URLSearchParams(payload).toString();
    const url = `/add-song?${queryString}`;
    router.push(url);
  };

  const ButtonsAtEnd = ({}) => {
    const btnArray = [
      {
        id: 0,
        text: "Add a Song",
        icon: (themeMode) => <AddSongIcon color={themeMode} />,
        onPress: () => navigateToAddSong(false),
      },
      {
        id: 1,
        text: "Request to Perform",
        icon: (themeMode) => (
          <RequestToPerfromIcon color={themeMode ? "#1F1F1F" : "#ffff"} />
        ),
        onPress: () => setShowModal(true),
      },
      {
        id: 2,
        text: "Live Video",
        icon: (themeMode) => (
          <LiveVideoIcon color={themeMode ? "#1F1F1F" : "#ffff"} />
        ),
        onPress: () => creatStreamUserHandler(),
      },
    ];

    return (
      <div
        className={`bottom-0 fixed py-5 px-4 ${themeMode ? " bg-light text-black" : "bg-light-tile text-white "} w-full rounded-t-3xl drop-shadow`}
      >
        <div className=" flex gap-5 items-center justify-between     ">
          {btnArray?.map((item, index) => {
            if (performer.length === 0 && item?.id === 1) {
              return null;
            }

            return (
              <button
                key={index}
                disabled={item?.id == 2 && currentActiveStreams == streamLimit}
                onClick={() => item?.onPress()}
                className=" flex flex-col justify-between items-center h-12"
              >
                <div>{item?.icon(themeMode)}</div>
                <div className=" text-sm">{item?.text}</div>
              </button>
            );
          })}
        </div>
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
      setVotingLoader(true);
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
      setVotingLoader(false);
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
      } h-screen overflow-y-scroll mx-auto    pt-5 pb-10`}
    >
      {loading ? (
        <div className=" flex items-center justify-center">
          <CustomLoader bgColor={themeMode ? "bg-[#1F1F1F]" : "bg-white"} />
        </div>
      ) : (
        <>
          <dialog ref={popUpRef} className="modal ">
            <div
              className={`modal-box   pt-10  rounded-md ${!themeMode ? "bg-black" : "bg-white"}`}
            >
              <button
                onClick={() => {
                  setShowModal(false);
                }}
                className={`btn btn-sm btn-circle btn-ghost absolute right-2 top-2 ${themeMode ? "text-black" : "text-white"} `}
              >
                ✕
              </button>
              <div className="flex gap-3 items-center mt-2 mb-5">
                <div
                  className={` h-20 w-20 rounded-md ${themeMode ? "bg-gray-100" : "bg-light-tile"} flex items-center justify-center`}
                >
                  <FaQuestion size={20} color="#EFC440" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-top-queue-bg">
                    Are you sure?
                  </h3>
                  <p className=" text-gray-400 text-sm">
                    {`This feature requires you as the customer to get up on our stage and perform to the song you select`}
                  </p>
                </div>
              </div>
              <div className="">
                <div className="w-full flex gap-2">
                  <button
                    className={`btn flex-1    border ${themeMode ? "border-black bg-white text-black" : "text-white bg-light-tile border-darkThemeBorder"} `}
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    No, cancel
                  </button>

                  <button
                    onClick={() => {
                      setShowModal(false);
                      navigateToAddSong(true);
                    }}
                    className="btn flex-1 bg-primary text-black border-none "
                  >
                    {"Yes, confirm"}
                  </button>
                </div>
              </div>
            </div>
          </dialog>

          <div className=" px-5">
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
                const isLocked = index < 2;
                return item?.requestToPerform && item?.tableNo == tableno ? (
                  <div
                    className={`  bg-gray-tile flex text-black rounded-md flex-wrap my-2`}
                    key={index}
                  >
                    <div className="w-1/2  text-start flex items-center ">
                      <p className="mx-6  font-extrabold text-lg  ">{`${
                        index < 2 ? index + 1 : ""
                      }`}</p>

                      <p
                        className={`font-semibold capitalize text-black   text-sm lg:text-lg`}
                      >
                        {item?.title}
                      </p>
                    </div>
                    <div
                      className={`w-1/2 p-4 flex justify-end  capitalize text-sm lg:text-lg`}
                    >
                      <div
                        className={` ${themeMode ? "bg-[#F7F7F7]  text-black" : "bg-black text-white"} font-semibold  rounded-3xl px-3 py-1 `}
                      >{`Table ${item?.tableNo}`}</div>
                    </div>
                  </div>
                ) : (
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
            </div>
          </div>
          <ButtonsAtEnd />
        </>
      )}
      {votingLoader && <ScreenLoader openModal={votingLoader} />}
    </div>
  );
};

export default TableView;
