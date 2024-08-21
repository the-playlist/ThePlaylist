"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaForward, FaHeart, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { IoArrowBackOutline } from "react-icons/io5";
import { TbMusicX } from "react-icons/tb";
import { SelectSongModal, SongCountdownTimer } from "../../_components";
import {
  useLazyGetSongsFromPlaylistQuery,
  useLazyGetAssignSongsWithPlayersQuery,
  useDeleteSongFromPlaylistByIdMutation,
  useUpdateSortOrderOfSongsMutation,
  useUpdatePlaylistTypeMutation,
  useDeleteAllSongsFromPlaylistMutation,
  useUndoDeletedSongsFromPlaylistMutation,
  useRevertMasterCheckMutation,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { io } from "socket.io-client";
import { IoArrowUndo } from "react-icons/io5";
import { SortByMasterIcon, RevertMasterIcon } from "@/app/svgs";
import { useDispatch } from "react-redux";
import {
  setCurrentSong,
  setPlayingState,
  setPlaylistLength,
  setSongsListUpdate,
  setPlaylistSongList as setPlayListSongListLocalStoage,
  setCurrentSongSecond,
  setIsFirstTimeFetched,
  setInitialSongPlaylist,
} from "@/app/_utils/redux/slice/playlist-list";
import { useSelector } from "react-redux";
import { convertTimeToSeconds, useOnlineStatus } from "../../_utils/helper";
import ConfirmationPopup from "@/app/_components/confirmation-popup";
import CountDown from "./coutdown";
import { playlistAlgorithm } from "../../../../backend/algorithm/playlistAlgo";
import { CustomLoader } from "@/app/_components/custom_loader";
import { EllipsisText } from "@/app/_components/ellipsis-text";
import DraggableList from "react-draggable-list";
import { PlaylistSongItem } from "./songItem";

const LAST_ACTION = "LAST_ACTION";
const ACTION_TYPE = {
  SINGLE_DEL: 1,
  CLEAR_LIST: 2,
};

const page = () => {
  const isOnline = useOnlineStatus();
  const [getPlaylistSongListApi, getPlaylistSongListResponse] =
    useLazyGetSongsFromPlaylistQuery();
  const [deleteAllSongsApi, deleteAllSongsResponse] =
    useDeleteAllSongsFromPlaylistMutation();
  const [updatePlaylistTypeAPI] = useUpdatePlaylistTypeMutation();
  const [updateSortOrderApi] = useUpdateSortOrderOfSongsMutation();
  const [revertMasterCheckApi] = useRevertMasterCheckMutation();
  const [deleteSongByIdApi] = useDeleteSongFromPlaylistByIdMutation();
  const [undoDeletedSongsAPI] = useUndoDeletedSongsFromPlaylistMutation();
  const [isFavSongs, setIsFavSongs] = useState(false);
  const [isUndoDisable, setIsUndoDisable] = useState(null);
  const [socket, setSocket] = useState();
  const [playlistSongList, setPlaylistSongList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);
  const [showCountDown, setShowCountDown] = useState(false);
  const [isFavExist, setIsFavExist] = useState([]);
  const dispatch = useDispatch();
  const [votingList, setVotingList] = useState(null);
  const [crownLoader, setCrownLoader] = useState(null);
  const data = Array(10)
    .fill(null)
    .map((item, index) => ({ id: index }));

  const playingState = useSelector(
    (state) => state?.playlistReducer?.playingState
  );
  const currentSongSecond = useSelector(
    (state) => state?.playlistReducer?.currentSongSecond
  );
  const isAdvanceTheQueeDisable = useSelector(
    (state) => state?.playlistReducer?.isAdvanceTheQueeDisable
  );
  const initialSongPlaylist_ = useSelector(
    (state) => state?.playlistReducer?.initialSongPlaylist
  );
  const initialSongPlaylist = JSON.parse(initialSongPlaylist_);

  const containerRef = useRef();

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

    //  comenting this out to avoid singnal response on the playlist, its done before to sync if more than master exists
    // socket.on("insertSongIntoPlaylistResponse", (item) => {
    //   const { playlist, isFirst, isFavSongs, currentSongSecond, isInsert } =
    //     item;

    //   if (isFavSongs != null) {
    //     setIsFavSongs(isFavSongs);
    //   }
    //   if (currentSongSecond != null) {
    //     dispatch(setCurrentSongSecond(currentSongSecond));
    //   }
    //   dispatch(setPlaylistLength(playlist?.length));
    //   const playlistWithId = playlist?.map((item, index) => ({
    //     ...item,
    //     id: index, // Add a unique id if it doesn't exist
    //   }));
    //   setPlaylistSongList([...playlistWithId]);
    // });
    socket.on("emptyPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      const playlistWithId = playlist?.map((item, index) => ({
        ...item,
        id: index, // Add a unique id if it doesn't exist
      }));
      setPlaylistSongList([...playlistWithId]);
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
      const playlistWithId = playlist?.map((item, index) => ({
        ...item,
        id: index, // Add a unique id if it doesn't exist
      }));
      setPlaylistSongList([...playlistWithId]);
    });
    socket.on("undoFavRes", (item) => {
      const { isFirst } = item;
      fetchPlaylistSongList(isFirst);
    });
    socket.on("RemoveSongFromPlaylistResponse", (item) => {
      const { playlist, isFirst, duration } = item;
      // dispatch(setCurrentSongSecond(duration));
      const playlistWithId = playlist?.map((item, index) => ({
        ...item,
        id: index, // Add a unique id if it doesn't exist
      }));
      setPlaylistSongList([...playlistWithId]);
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
      const playlistWithId = finalPlaylist?.map((item, index) => ({
        ...item,
        id: index, // Add a unique id if it doesn't exist
      }));
      setPlaylistSongList([...playlistWithId]);
    }
  }, [votingList]);

  useEffect(() => {
    setIsUndoDisable(JSON.parse(localStorage.getItem(LAST_ACTION)) == null);
    fetchPlaylistSongList(null);
  }, []);

  useEffect(() => {
    if (playlistSongList?.length > 0) {
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
      const newConnection = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        autoConnect: false,
      });
      newConnection.connect();
      if (response && !response.isError) {
        let isFav = response?.data?.content?.isFavortiteListType;
        let songList = response?.data?.content?.playlist;
        dispatch(setPlaylistLength(songList?.length));
        const playlistWithId = songList?.map((item, index) => ({
          ...item,
          id: index, // Add a unique id if it doesn't exist
        }));

        setPlaylistSongList(playlistWithId);
        setIsFavSongs(isFav);
        if (songList?.length > 0) {
          setIsFavExist(songList?.filter((item) => item?.isFav));
        }
        newConnection.emit("insertSongIntoPlaylistRequest", {
          isFirst: firstFetch ?? isFirst,
          playlist: playlistWithId,
          isInsert: false,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const [selectSongModal, setSelectSongModal] = useState(false);

  const deleteSongFromPlaylistHandler = async (id, isTrashPress) => {
    localStorage.setItem("isFirstTimeFetched", false);
    // !isTrashPress && dispatch(setInitialSongPlaylist(false));
    await removeItemById(id, isTrashPress);
    setUndoItemsInStorage({
      action: ACTION_TYPE.SINGLE_DEL,
      data: id,
    });
    if (playlistSongList?.length === 1) {
      dispatch(setCurrentSongSecond(0));
      dispatch(setSongsListUpdate());
    }

    let response = await deleteSongByIdApi({
      id: id,
      isDeleted: true,
    });

    if (playingState == true && !isTrashPress) {
      if (playlistSongList?.length > 1) {
        if (initialSongPlaylist) {
          dispatch(setPlayingState(false));
          setShowCountDown(true);
        }
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
    if (playlistSongList?.length > 1) {
      newSong = playlistSongList[1];
    }
    const playlistWithId = currentArray?.map((item, index) => ({
      ...item,
      id: index, // Add a unique id if it doesn't exist
    }));

    setPlaylistSongList(playlistWithId);
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

  const handleDragEnd = (result, source, destination, movedItem) => {
    dispatch(setIsFirstTimeFetched(false));
    const sourceIndex = source;
    const destinationIndex = destination;
    if (sourceIndex != destinationIndex) {
      const index = result.findIndex((item) => item._id === movedItem._id);
      const updatedPlaylist = [
        ...result.slice(0, index),
        { ...movedItem, sortByMaster: true },
        ...result.slice(index + 1),
      ];
      socket.emit("handleDragReq", {
        isFirst: false,
        playlist: updatedPlaylist,
      });
      // const newList = playlistAlgorithm(false, updatedPlaylist);
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
    // dispatch(setInitialSongPlaylist(false));
    try {
      await updateSortOrderApi({
        songsList: payload,
      });
      socket.emit("addSongToPlaylistApi", { payload: payload, isFirst: false });
    } catch (error) {
      console.log(error);
    }
  };
  function updateObjectInArray(arr, updatedObject) {
    return arr.map((item) =>
      item._id === updatedObject._id ? { ...item, ...updatedObject } : item
    );
  }

  const revertCrownhandler = async (item) => {
    let isFirst = localStorage.getItem("isFirstTimeFetched");
    item = { ...item, sortByMaster: false };
    const response = await revertMasterCheckApi({
      item: item,
    });
    setCrownLoader(null);
    let updatedPlaylist = [...playlistSongList];
    const updatedList = updateObjectInArray(updatedPlaylist, item);
    const newList = playlistAlgorithm(isFirst, updatedList);
    const playlistWithId = newList?.map((item, index) => ({
      ...item,
      id: index, // Add a unique id if it doesn't exist
    }));
    setPlaylistSongList([...playlistWithId]);
    socket.emit("handleDragReq", {
      isFirst: false,
      playlist: newList,
    });
    toast.success(response?.data?.description);
  };

  const toggleFavSongs = async () => {
    if (!isFavSongs) {
      let isFirst = localStorage.getItem("isFirstTimeFetched");
      const updatedPlaylist = [...playlistSongList];
      let favSongsList = updatedPlaylist.filter((item) => item.isFav);
      favSongsList = playlistAlgorithm(isFirst, favSongsList);
      const playlistWithId = favSongsList?.map((item, index) => ({
        ...item,
        id: index, // Add a unique id if it doesn't exist
      }));
      setPlaylistSongList(playlistWithId);
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
    dispatch(setInitialSongPlaylist(true));
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
                    disabled={playlistSongList?.length == 0}
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
          {playlistSongList?.length === 0 &&
            !getPlaylistSongListResponse.isFetching && (
              <div className="flex items-center justify-center mt-10 md:h-[770px] sm:h-[560px]">
                <span className=" text-black font-semibold ">
                  Currently there are no songs available in the playlist
                </span>
              </div>
            )}
          {playlistSongList?.length > 0 && (
            <>
              <div className="text-base font-medium text-black text-center flex mt-10 mb-5  px-5 ">
                <div className="w-1/12"></div>
                <div className="w-2/12 ">Title</div>
                <div className="w-1/12"></div>
                <div className="w-3/12">Player</div>
                <div className="w-2/12">Intro</div>
                <div className="w-2/12">Category</div>
                <div className="w-1/12"></div>
              </div>

              {/* <div
            className={`overflow-y-auto ${
              playlistSongList?.length > 0 ? "h-[750px]" : "h-[800px]"
            } pb-10 `}
          > */}
              <div className="border-separate border-spacing-y-5 mx-1 mb-10  ">
                <div
                  // style={{ touchAction: "pan-y", background: "#F9F9F9" }}
                  id="scrollableContainer"
                  ref={containerRef}
                  className=" overflow-y-auto lg:h-[630px] md:h-[550px]"
                  // style={{ overflowY: "auto", height: "630px" }}
                >
                  <DraggableList
                    unsetZIndex={true}
                    itemKey="id"
                    template={({ item, itemSelected, dragHandleProps }) => {
                      return (
                        <PlaylistSongItem
                          item={item}
                          itemSelected={itemSelected}
                          dragHandleProps={dragHandleProps}
                          playlistSongList={playlistSongList}
                          revertCrownhandler={revertCrownhandler}
                          deleteSongFromPlaylistHandler={
                            deleteSongFromPlaylistHandler
                          }
                          socket={socket}
                          setShowCountDown={setShowCountDown}
                          loading={crownLoader}
                          setLoader={setCrownLoader}
                        />
                      );
                    }}
                    list={playlistSongList}
                    onMoveEnd={(newList, movedItem, oldIndex, newIndex) => {
                      if (oldIndex != 0 && oldIndex != 1) {
                        if (newIndex != 0 && newIndex != 1) {
                          handleDragEnd(newList, oldIndex, newIndex, movedItem);
                        }
                      }
                    }}
                    container={() => containerRef.current}
                  />
                </div>
              </div>
            </>
          )}
          {/* </div> */}
          {!isFavSongs && (
            <div className="sticky bottom-0 w-full flex  z-10 items-center justify-center py-4 bg-[#fafafa]">
              <button
                onClick={async () => {
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
                  onReload={() => {
                    setIsLoading(true);
                  }}
                  btnText={"Add"}
                  title={"Select songs"}
                  openModal={selectSongModal}
                  fetchList={fetchPlaylistSongList}
                  closeModal={() => {
                    setSelectSongModal(false);
                  }}
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
          {/* {showCountDown && (
            <CountDown
              setShowCountDown={setShowCountDown}
              openModal={showCountDown}
              timer={10}
              socket={socket}
            />
          )} */}
        </>
      )}
    </div>
  );
};

export default page;
