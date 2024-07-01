"use client";

import React, { useState, useEffect } from "react";
import { FaForward, FaHeart, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { IoArrowBackOutline } from "react-icons/io5";
import { TbMusicX } from "react-icons/tb";
import {
  CustomLoader,
  SelectSongModal,
  SongCountdownTimer,
} from "../../_components";
import {
  useLazyGetSongsFromPlaylistQuery,
  useLazyGetAssignSongsWithPlayersQuery,
  useDeleteSongFromPlaylistByIdMutation,
  useUpdateSortOrderOfSongsMutation,
  useUpdatePlaylistTypeMutation,
  useDeleteAllSongsFromPlaylistMutation,
  useUndoDeletedSongsFromPlaylistMutation,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { io } from "socket.io-client";
import { IoArrowUndo } from "react-icons/io5";
import { SortByMasterIcon } from "@/app/svgs";
import { useDispatch } from "react-redux";
import {
  setCurrentSong,
  setPlayingState,
  setPlaylistLength,
  setSongsListUpdate,
  setPlaylistSongList as setPlayListSongListLocalStoage,
  setCurrentSongSecond,
  setIsFirstTimeFetched,
} from "@/app/_utils/redux/slice/playlist-list";
import { useSelector } from "react-redux";
import { convertTimeToSeconds } from "../../_utils/helper";
import ConfirmationPopup from "@/app/_components/confirmation-popup";
import CountDown from "./coutdown";
import Ticker from "react-ticker";
import { playlistAlgorithm } from "../../../../backend/algorithm/playlistAlgo";

const LAST_ACTION = "LAST_ACTION";
const ACTION_TYPE = {
  SINGLE_DEL: 1,
  CLEAR_LIST: 2,
};

const page = () => {
  const [getPlaylistSongListApi, getPlaylistSongListResponse] =
    useLazyGetSongsFromPlaylistQuery();
  const [deleteAllSongsApi, deleteAllSongsResponse] =
    useDeleteAllSongsFromPlaylistMutation();
  const [updatePlaylistTypeAPI] = useUpdatePlaylistTypeMutation();
  const [updateSortOrderApi] = useUpdateSortOrderOfSongsMutation();
  const [getAssignSongsApi] = useLazyGetAssignSongsWithPlayersQuery();
  const [deleteSongByIdApi] = useDeleteSongFromPlaylistByIdMutation();
  const [undoDeletedSongsAPI] = useUndoDeletedSongsFromPlaylistMutation();
  const [isFavSongs, setIsFavSongs] = useState(false);
  const [isUndoDisable, setIsUndoDisable] = useState(null);
  const [socket, setSocket] = useState();
  const [playlistSongList, setPlaylistSongList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playlistCount, setPlaylistCount] = useState(0);
  const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);
  const [showCountDown, setShowCountDown] = useState(false);
  const [isFavExist, setIsFavExist] = useState([]);
  const dispatch = useDispatch();
  const [votingList, setVotingList] = useState(null);

  const playingState = useSelector(
    (state) => state?.playlistReducer?.playingState
  );
  const currentSongSecond = useSelector(
    (state) => state?.playlistReducer?.currentSongSecond
  );
  const isAdvanceTheQueeDisable = useSelector(
    (state) => state?.playlistReducer?.isAdvanceTheQueeDisable
  );

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();
    socket.on("insertSongIntoPlaylistResponse", (item) => {
      const { playlist, isFirst, isFavSongs, currentSongSecond, isInsert } =
        item;

      if (isFavSongs != null) {
        setIsFavSongs(isFavSongs);
      }
      if (currentSongSecond != null) {
        dispatch(setCurrentSongSecond(currentSongSecond));
      }
      dispatch(setPlaylistLength(playlist?.length));
      setPlaylistSongList([...playlist]);
    });
    socket.on("emptyPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      setPlaylistSongList([...playlist]);
      dispatch(setPlaylistLength(0));
      dispatch(setCurrentSongSecond(0));
      dispatch(setPlayingState(false));
    });
    socket.on("voteCastingResponse", (item) => {
      const { isFirst } = item;
      localStorage.setItem("isFirstTimeFetched", isFirst);
      setVotingList(item || {});
    });
    socket.on("songAddByCustomerRes", (item) => {
      const { playlist, isFirst } = item;
      setPlaylistSongList([...playlist]);
    });
    socket.on("undoFavRes", (item) => {
      const { isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });
    socket.on("RemoveSongFromPlaylistResponse", (item) => {
      const { playlist, isFirst, duration } = item;
      // dispatch(setCurrentSongSecond(duration));
      setPlaylistSongList([...playlist]);
    });

    setSocket(socket);
  }, []);

  useEffect(() => {
    if (votingList != null) {
      const playlistSongListCopy = [...playlistSongList];
      function findAndIncrementUpVote() {
        const foundIndex = playlistSongList?.findIndex(
          (song) => song._id == votingList?.id
        );
        if (foundIndex !== -1) {
          let updatedSong = { ...playlistSongList[foundIndex] };
          if (votingList?.isIncrement == true) {
            updatedSong.upVote += 1;
            if (updatedSong.downVote > 0) {
              if (votingList?.isVoted) {
                updatedSong.downVote -= 1;
              }
            }
          } else {
            updatedSong.downVote += 1;
            if (updatedSong.upVote > 0) {
              if (votingList?.isVoted) {
                updatedSong.upVote -= 1;
              }
            }
          }
          playlistSongListCopy[foundIndex] = updatedSong;
          return playlistSongListCopy;
        }
      }

      const finalPlaylist = playlistAlgorithm(
        votingList?.isFirst,
        findAndIncrementUpVote()
      );
      socket.emit("wallPlayerViewReq", {
        isFirst: votingList?.isFirst,
        playlist: finalPlaylist,
      });
      setPlaylistSongList([...finalPlaylist]);
    }
  }, [votingList]);

  useEffect(() => {
    setIsUndoDisable(JSON.parse(localStorage.getItem(LAST_ACTION)) == null);
    fetchPlaylistSongList(null);
  }, []);

  useEffect(() => {
    if (playlistSongList.length > 0) {
      const storedSeconds = parseInt(currentSongSecond);
      const initialSongDuration = convertTimeToSeconds(
        playlistSongList[0].songDuration
      );
      const { playerName, title, _id } = playlistSongList[0];
      dispatch(setPlayListSongListLocalStoage(playlistSongList));
      dispatch(
        setCurrentSong({
          title: title,
          playerName: playerName,
          id: _id,
          duration: convertTimeToSeconds(playlistSongList[0].songDuration),
        })
      );

      if (storedSeconds == 0 && storedSeconds === initialSongDuration) {
        return;
      }

      if (!storedSeconds) {
        dispatch(setCurrentSongSecond(initialSongDuration));
        return;
      }

      if (initialSongDuration > storedSeconds) {
        dispatch(setCurrentSongSecond(storedSeconds));
        return;
      }

      dispatch(setCurrentSongSecond(initialSongDuration));
    }

    return () => {};
  }, [playlistSongList]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isUndoDisable) {
        localStorage.setItem(LAST_ACTION, null);
        setIsUndoDisable(true);
      }
    }, 30000);

    return () => clearTimeout(timeoutId); // Cleanup function to clear timeout on unmount
  }, [isUndoDisable]); // Empty dependency array ensures it runs only once on mount

  const fetchPlaylistSongList = async (firstFetch) => {
    let isFirst = localStorage.getItem("isFirstTimeFetched");

    try {
      // setIsLoading(true);

      let response = await getPlaylistSongListApi(firstFetch ?? isFirst);
      if (response && !response.isError) {
        let isFav = response?.data?.content?.isFavortiteListType;
        let songList = response?.data?.content?.playlist;
        dispatch(setPlaylistLength(songList?.length));
        setPlaylistSongList(songList);
        setIsFavSongs(isFav);
        if (songList?.length > 0) {
          setIsFavExist(songList?.filter((item) => item?.isFav));
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const [selectSongModal, setSelectSongModal] = useState(false);
  const [assignSongsList, setAssignSongsList] = useState([]);

  const fetchAssignSongsList = async () => {
    try {
      let response = await getAssignSongsApi(null);
      if (response && !response.isError) {
        const { list, playlistCount } = response?.data?.content;
        setPlaylistCount(playlistCount);
        setAssignSongsList(list);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  const deleteSongFromPlaylistHandler = async (id, isTrashPress) => {
    localStorage.setItem("isFirstTimeFetched", false);
    await removeItemById(id, isTrashPress);
    setUndoItemsInStorage({
      action: ACTION_TYPE.SINGLE_DEL,
      data: id,
    });
    if (playlistSongList.length === 1) {
      dispatch(setCurrentSongSecond(0));
      dispatch(setSongsListUpdate());
    }

    let response = await deleteSongByIdApi({
      id: id,
      isDeleted: true,
    });

    if (playingState == true && !isTrashPress) {
      if (playlistSongList.length > 1) {
        dispatch(setPlayingState(false));
        setShowCountDown(true);
        socket.emit("bufferTimeReq", {
          time: 10,
        });
      }
    }

    if (response && !response.error) {
      toast(response?.data?.description);
    } else {
      toast.error(response?.data?.description || "Something Went Wrong...");
    }
  };
  const removeItemById = async (id, isTrashPress) => {
    let currentArray = [...playlistSongList];
    await setPlaylistSongList([]);
    currentArray = currentArray.filter((item) => item._id != id);
    if (currentArray?.length > 0) {
      setIsFavExist(currentArray?.filter((item) => item?.isFav));
    }
    let newSong;
    if (playlistSongList.length > 1) {
      newSong = playlistSongList[1];
    }
    setPlaylistSongList(currentArray);
    if (!isTrashPress && currentArray?.length > 0) {
      dispatch(
        setCurrentSongSecond(convertTimeToSeconds(newSong?.songDuration))
      );
    }
    socket.emit("RemoveSongFromPlaylistRequest", {
      isFirst: false,
      playlist: currentArray,
      time: 10,
    });
  };
  const handleDragEnd = (result, index) => {
    if (!result.destination) return;
    dispatch(setIsFirstTimeFetched(false));
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex != destinationIndex) {
      const updatedPlaylist = [...playlistSongList];
      const [reorderedItem] = updatedPlaylist.splice(sourceIndex, 1);
      const updatedReorderItem = { ...reorderedItem, sortByMaster: true };
      updatedPlaylist.splice(destinationIndex, 0, updatedReorderItem);
      socket.emit("handleDragReq", {
        isFirst: false,
        playlist: updatedPlaylist,
      });
      setPlaylistSongList([...updatedPlaylist]);
      const updatedArr = updatedPlaylist.map((item, index) => ({
        id: item._id,
        newSortOrder: index,
        sortByMaster: item?.sortByMaster,
      }));
      updateSongsOrderHandler(updatedArr);
    }
  };
  const updateSongsOrderHandler = async (payload) => {
    localStorage.setItem("isFirstTimeFetched", false);
    try {
      await updateSortOrderApi({
        songsList: payload,
      });
      socket.emit("addSongToPlaylistApi", { payload: payload, isFirst: false });
    } catch (error) {
      console.log(error);
    }
  };
  const toggleFavSongs = async () => {
    if (!isFavSongs) {
      const updatedPlaylist = [...playlistSongList];
      const favSongsList = updatedPlaylist.filter((item) => item.isFav);
      setPlaylistSongList(favSongsList);
      const initialSongDuration = convertTimeToSeconds(
        favSongsList[0].songDuration
      );
      dispatch(setCurrentSongSecond(initialSongDuration));
      socket.emit("insertSongIntoPlaylistRequest", {
        isFirst: true,
        playlist: favSongsList,
        isFavSongs: !isFavSongs,
        currentSongSecond: initialSongDuration,
      });
    } else {
      socket.emit("undoFavReq", {
        isFirst: true,
      });
      setIsLoading(true);
      fetchPlaylistSongList();
    }
    setIsFavSongs(!isFavSongs);
    await updatePlaylistTypeAPI({
      isFavortiteListType: !isFavSongs,
    });
  };
  const setUndoItemsInStorage = (data) => {
    localStorage.setItem(LAST_ACTION, JSON.stringify(data));
    setIsUndoDisable(false);
  };
  const deleteAllSongsHandler = async () => {
    dispatch(setPlayingState(false));
    localStorage.setItem("isFirstTimeFetched", true);
    dispatch(setCurrentSongSecond(0));
    dispatch(setSongsListUpdate());
    dispatch(setPlaylistLength(0));
    let response = await deleteAllSongsApi();
    if (response && !response.error) {
      setIsConfirmationPopup(false);
      toast.success(response?.data?.description);
      dispatch(setCurrentSongSecond(0));
      dispatch(setSongsListUpdate());
      dispatch(setPlayingState(false));
      dispatch(setSongsListUpdate());
      setPlaylistSongList([]);
      socket.emit("emptyPlaylistRequest", {
        isFirst: true,
        playlist: [],
      });
    }
  };
  const onUndoPressHandler = async () => {
    setIsLoading(true);
    const lastAction = JSON.parse(localStorage.getItem(LAST_ACTION));
    switch (lastAction.action) {
      case ACTION_TYPE.SINGLE_DEL: // handle the logic for single Delete
        await deleteSongByIdApi({
          id: lastAction?.data,
          isDeleted: false,
        });
        socket.emit("undoActionRequest", {
          lastAction: lastAction?.data,
          isFirst: false,
        });
        await setPlaylistSongList([]);
        await fetchPlaylistSongList();
        localStorage.setItem(LAST_ACTION, null);
        setIsUndoDisable(true);
        break;
      case ACTION_TYPE.CLEAR_LIST: // handle the logic for clear list
        const listItems = lastAction.data.map((item) => item._id);
        await undoDeletedSongsAPI({ data: listItems });

        socket.emit("undoActionRequest", {
          lastAction: lastAction?.data,
          isFirst: false,
        });
        await fetchPlaylistSongList();
        localStorage.setItem(LAST_ACTION, null);
        setIsUndoDisable(true);

      default:
        break;
    }
  };

  return (
    <div className="">
      {isLoading ? (
        <CustomLoader />
      ) : (
        <>
          <div
            className={`flex items-center ${
              playlistSongList?.length > 0 ? "justify-between" : "justify-end"
            } items-center mx-1 mt-5`}
          >
            {playlistSongList?.length > 0 && (
              <button
                disabled={isAdvanceTheQueeDisable}
                onClick={async () => {
                  await deleteSongFromPlaylistHandler(playlistSongList[0]?._id);
                  if (playlistSongList?.length > 0) {
                    const songDuration = convertTimeToSeconds(
                      playlistSongList[1]?.songDuration
                    );
                    dispatch(setCurrentSongSecond(songDuration));
                  } else {
                    dispatch(setCurrentSongSecond(0));
                  }
                  dispatch(setSongsListUpdate());
                }}
                className="flex items-center hover:cursor-pointer bg-black hover:bg-primary hover:text-black text-white font-bold py-3 px-4  lg:text-lg justify-center rounded-lg"
              >
                <span className="mr-2">Advance the Queue</span>
                <FaForward />
              </button>
            )}
            <div className="flex flex-row  ">
              {!isFavSongs && playlistSongList?.length > 0 && (
                <button
                  className="border-black border rounded p-3 flex-grow-0 mr-2 text-black transition-transform transform hover:scale-105"
                  onClick={() => setIsConfirmationPopup(true)}
                >
                  <span className="flex flex-row items-center">
                    <TbMusicX className="mr-2" />
                    Clear Songs
                  </span>
                </button>
              )}
              {isFavExist?.length > 0 &&
                (isFavSongs || playlistSongList?.length > 0) && (
                  <button
                    disabled={playlistSongList.length == 0}
                    onClick={toggleFavSongs}
                    className={`flex items-center hover:cursor-pointer border ${
                      !isFavSongs ? "border-black" : "border-top-queue-bg"
                    }  ${
                      !isFavSongs
                        ? "hover:bg-black hover:text-white text-black"
                        : "text-top-queue-bg"
                    }   font-bold py-3 px-4 lg:text-xl justify-center rounded`}
                  >
                    {isFavSongs ? <IoArrowBackOutline /> : <FaHeart />}
                    <span className="ml-2">
                      {isFavSongs ? "Back to Playlist" : "Play Favorite songs"}
                    </span>
                  </button>
                )}
            </div>
          </div>
          {playlistSongList.length > 0 && (
            <div className="text-base font-medium text-black text-center flex mt-10 mb-5  px-5 ">
              <div className="w-1/12"></div>
              <div className="w-2/12 ">Title</div>
              <div className="w-1/12"></div>
              <div className="w-3/12">Player</div>
              <div className="w-2/12">Intro</div>
              <div className="w-2/12">Category</div>
              <div className="w-1/12"></div>
            </div>
          )}
          <div
            className={`overflow-y-auto ${
              playlistSongList.length > 0 ? "h-[700px]" : "h-[800px]"
            } pb-10 `}
          >
            <div className="border-separate border-spacing-y-5 mx-1 mb-10  ">
              {playlistSongList.length === 0 &&
                !getPlaylistSongListResponse.isFetching && (
                  <div className="flex items-center justify-center mt-10">
                    <span className=" text-black font-semibold ">
                      Currently there are no songs available in the playlist
                    </span>
                  </div>
                )}

              <DragDropContext
                onDragEnd={(result, index) => {
                  if (result?.destination?.index > 1) {
                    handleDragEnd(result);
                  }
                }}
              >
                <Droppable droppableId="list">
                  {(provided, snapshot) => (
                    <div {...provided?.droppableProps} ref={provided?.innerRef}>
                      {playlistSongList.map((item, index) => {
                        const {
                          title,
                          upVote,
                          downVote,
                          playerName,
                          introSec,
                          category,
                          isFav,
                          sortOrder,
                          sortByMaster,
                          songDuration,
                        } = item || {};
                        const trimmedTitle =
                          title?.length > 16
                            ? `${title?.slice(0, 16)}...`
                            : title;
                        const isLockedSongs = index == 0 || index == 1;
                        return (
                          <Draggable
                            key={sortOrder}
                            draggableId={sortOrder.toString()}
                            index={index}
                            isDragDisabled={isLockedSongs}
                          >
                            {(provided, snapshot) => {
                              return (
                                <>
                                  <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                  >
                                    <div
                                      key={index}
                                      className={` text-center ${
                                        isLockedSongs
                                          ? "bg-top-queue-bg"
                                          : "bg-white"
                                      }  shadow rounded-2xl h-20 flex items-center mb-4 px-5`}
                                    >
                                      <div className="w-1/12 text-start font-extrabold text-lg">
                                        {!isLockedSongs ? (
                                          <div className="border flex items-center justify-center text-top-queue-bg border-gray-300 rounded-full h-10 w-10 cursor-pointer">
                                            {sortByMaster ? (
                                              <SortByMasterIcon />
                                            ) : (
                                              <HiOutlineArrowsUpDown />
                                            )}
                                          </div>
                                        ) : (
                                          index + 1
                                        )}
                                      </div>
                                      <div className="w-2/12 pr-10">
                                        {title?.length > 12 ? (
                                          <Ticker>
                                            {({ index }) => (
                                              <>
                                                <h1 className=" px-1 ">
                                                  {title}
                                                </h1>
                                              </>
                                            )}
                                          </Ticker>
                                        ) : (
                                          title
                                        )}
                                      </div>
                                      <div className="w-1/12">
                                        {!isLockedSongs && (
                                          <div className="flex items-center justify-center">
                                            <div className="bg-[#f1f7ee] px-5 mr-2 py-3 flex items-center rounded-3xl">
                                              <div className="flex items-center justify-center bg-green-500 rounded-full shadow w-6 h-6 mr-2">
                                                <IoIosArrowUp
                                                  size={18}
                                                  color={"white"}
                                                />
                                              </div>
                                              {upVote}
                                            </div>
                                            <div className="bg-[#FCEDED] px-5 py-3 flex items-center rounded-3xl">
                                              <div className="flex items-center justify-center bg-red-500 rounded-full shadow w-6 h-6 mr-2">
                                                <IoIosArrowDown
                                                  size={18}
                                                  color={"white"}
                                                />
                                              </div>
                                              {downVote}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="w-3/12">{playerName}</div>
                                      <div className="w-2/12 flex items-center justify-center">
                                        <div className="bg-white shadow flex items-center justify-center mt-2 h-10 w-10 rounded-full">
                                          {introSec || 0}
                                        </div>
                                      </div>
                                      <div
                                        className={`w-2/12 flex items-center justify-center `}
                                      >
                                        <div
                                          className={` ${
                                            index > 1
                                              ? "bg-[#F7F7F7]"
                                              : "bg-white"
                                          } rounded-3xl px-5 py-2`}
                                        >
                                          {category}
                                        </div>
                                      </div>
                                      <div className="w-1/12">
                                        <div className="flex items-center justify-end ">
                                          {index === 0 && (
                                            <SongCountdownTimer
                                              socket={socket}
                                              orignalSongDuration={songDuration}
                                              setShowCountDown={
                                                setShowCountDown
                                              }
                                              duration={currentSongSecond}
                                              advanceTheQueue={() => {
                                                deleteSongFromPlaylistHandler(
                                                  playlistSongList[0]?._id
                                                );
                                              }}
                                              playlistSongList={
                                                playlistSongList
                                              }
                                              isStart={playingState}
                                            />
                                          )}
                                          {isFav && (
                                            <FaHeart
                                              className={`${
                                                isLockedSongs
                                                  ? "text-white"
                                                  : "text-primary"
                                              }`}
                                              size={20}
                                            />
                                          )}
                                          {!isLockedSongs && (
                                            <button
                                              onClick={() => {
                                                deleteSongFromPlaylistHandler(
                                                  item?._id,
                                                  true
                                                );
                                              }}
                                              className=" hover:cursor-pointer ml-5"
                                            >
                                              <FaTrashAlt
                                                className="text-red-500"
                                                size={20}
                                              />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
          {!isFavSongs && (
            <div className="sticky bottom-0 w-full flex  items-center justify-center py-4 bg-[#fafafa]">
              <button
                onClick={async () => {
                  await fetchAssignSongsList();
                  setSelectSongModal(true);
                }}
                className="flex text-base w-full items-center bg-top-queue-bg hover:bg-yellow-500 hover:text-black text-black font-bold py-3 px-4 rounded-md justify-center"
              >
                + Add a Song
              </button>
              <button
                disabled={isUndoDisable}
                onClick={onUndoPressHandler}
                className={`ml-4  w-full shadow-md text-base flex items-center bg-white ${
                  isUndoDisable &&
                  "bg-slate-200 cursor-not-allowed text-slate-400"
                }   text-black font-bold py-3 px-4 rounded-md justify-center ${
                  !isUndoDisable && "hover:bg-active-tab"
                }`}
              >
                <IoArrowUndo />
                <span className="ml-2">Undo Action</span>
              </button>
              {selectSongModal && (
                <SelectSongModal
                  playlistCount={playlistCount}
                  items={assignSongsList}
                  btnText={"Add"}
                  title={"Select songs"}
                  openModal={selectSongModal}
                  fetchList={() => {
                    console.log("fetch list");
                  }}
                  closeModal={() => {
                    setSelectSongModal(false);
                  }}
                />
              )}
              {showCountDown && (
                <CountDown
                  setShowCountDown={setShowCountDown}
                  openModal={showCountDown}
                  timer={10}
                  socket={socket}
                />
              )}
              {isConfirmationPopup && (
                <ConfirmationPopup
                  isLoading={deleteAllSongsResponse?.isLoading}
                  title={"Are you sure to remove all songs from playlist?"}
                  onYesPress={deleteAllSongsHandler}
                  closeModal={() => setIsConfirmationPopup(false)}
                  openModal={isConfirmationPopup}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default page;
