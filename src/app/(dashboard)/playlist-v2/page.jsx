"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaForward, FaHeart, FaTrashAlt } from "react-icons/fa";
import { TbMusicX } from "react-icons/tb";
import { IoArrowBackOutline } from "react-icons/io5";

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
  useLazyGetSongsFromPlaylistV2Query,
  useDeleteSongFromPlaylistByIdV2Mutation,
  useDeleteAllSongsFromPlaylistV2Mutation,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";
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
  setInitialSongPlaylist,
  setIsAdvanceTheQueeDisable,
  setCheckIsFixed,
} from "@/app/_utils/redux/slice/playlist-list";
import { useSelector } from "react-redux";
import { convertTimeToSeconds, useOnlineStatus } from "../../_utils/helper";
import ConfirmationPopup from "@/app/_components/confirmation-popup";
import { playlistAlgorithm } from "../../../../backend/algorithm/playlistAlgo";
import { CustomLoader } from "@/app/_components/custom_loader";

import DraggableList from "react-draggable-list";
import { PlaylistSongItemV2 } from "./songItem";
import { EllipsisText } from "@/app/_components/ellipsis-text";

const LAST_ACTION = "LAST_ACTION";
const ACTION_TYPE = {
  SINGLE_DEL: 1,
  CLEAR_LIST: 2,
};

const page = () => {
  const containerRef = useRef();
  const dispatch = useDispatch();
  const isOnline = useOnlineStatus();
  const [getPlaylistSongListApi, getPlaylistSongListResponse] =
    useLazyGetSongsFromPlaylistV2Query();
  const [fixedContent, setFixedContent] = useState([]);
  const [nonFixedContent, setNonFixedContent] = useState([]);
  const [completeList, setCompleteList] = useState([]);
  const [deleteAllSongsApi, deleteAllSongsResponse] =
    useDeleteAllSongsFromPlaylistV2Mutation();
  const [updatePlaylistTypeAPI] = useUpdatePlaylistTypeMutation();
  const [updateSortOrderApi] = useUpdateSortOrderOfSongsMutation();
  const [revertMasterCheckApi] = useRevertMasterCheckMutation();
  const [deleteSongByIdApi] = useDeleteSongFromPlaylistByIdV2Mutation();
  const [undoDeletedSongsAPI] = useUndoDeletedSongsFromPlaylistMutation();
  const [isFavSongs, setIsFavSongs] = useState(false);
  const [isUndoDisable, setIsUndoDisable] = useState(null);
  const [socket, setSocket] = useState();
  const [playlistSongList, setPlaylistSongList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);
  const [isFavExist, setIsFavExist] = useState([]);
  const [votingList, setVotingList] = useState(null);
  const [crownLoader, setCrownLoader] = useState(null);
  const [selectSongModal, setSelectSongModal] = useState(false);
  const [songAddedByCustomer, setSongAddedByCustomer] = useState(null);

  const playingState = useSelector(
    (state) => state?.playlistReducer?.playingState
  );
  const currentSongSecond = useSelector(
    (state) => state?.playlistReducer?.currentSongSecond
  );
  const isAdvanceTheQueeDisable = useSelector(
    (state) => state?.playlistReducer?.isAdvanceTheQueeDisable
  );
  const checkIsFixed = useSelector(
    (state) => state?.playlistReducer?.checkIsFixed
  );

  const initialSongPlaylist_ = useSelector(
    (state) => state?.playlistReducer?.initialSongPlaylist
  );
  const initialSongPlaylist = JSON.parse(initialSongPlaylist_);

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
    setSocket(socket);

    socket.on("emptyPlaylistResponse", (item) => {
      const { playlist, isFirst } = item;
      const playlistWithId = playlist?.map((item, index) => ({
        ...item,
        id: index, // Add a unique id if it doesn't exist
      }));
      fetchPlaylistSongList();
      dispatch(setPlaylistLength(0));
      dispatch(setCurrentSongSecond(0));
      dispatch(setPlayingState(false));
    });
    socket.on("voteCastingResponse", (item) => {
      setVotingList(item || {});
    });
    socket.on("songAddByCustomerRes", (item) => {
      const { song, playlistCount } = item;

      setSongAddedByCustomer(song);

      // const playlistWithId = playlist?.map((item, index) => ({
      //   ...item,
      //   id: index, // Add a unique id if it doesn't exist
      // }));
      // setPlaylistSongList([...playlistWithId]);
    });

    socket.on("disconnect", async (reason) => {
      socket.disconnect();
      console.log(`Socket disconnected socket connection test: ${reason}`);
      socket.connect();
      await fetchPlaylistSongList(null);
    });
  }, []);

  useEffect(() => {
    if (votingList != null) {
      const playlistSongListCopy = [...completeList];
      function findAndIncrementUpVote() {
        const foundIndex = completeList?.findIndex(
          (song) => song._id == votingList?.id
        );
        if (foundIndex !== -1) {
          let updatedSong = { ...completeList[foundIndex] };
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
      const playlistWithId = finalPlaylist?.map((item, index) => ({
        ...item,
        id: index, // Add a unique id if it doesn't exist
      }));
      const tempNonFixed = playlistWithId.filter((song) => !song.isFixed);
      const tempFixed = playlistWithId.filter((song) => song.isFixed);
      setFixedContent([...tempFixed]);
      setNonFixedContent([...tempNonFixed]);
      socket.emit("wallPlayerViewReq", {
        isFirst: votingList?.isFirst,
        playlist: finalPlaylist,
      });

      setCompleteList([...playlistWithId]);
    }
  }, [votingList]);

  useEffect(() => {
    setIsUndoDisable(JSON.parse(localStorage.getItem(LAST_ACTION)) == null);
  }, []);

  useEffect(() => {
    if (fixedContent?.length > 0) {
      const storedSeconds = parseInt(currentSongSecond);
      const initialSongDuration = convertTimeToSeconds(
        fixedContent[0].songDuration
      );
      const { playerName, title, _id } = fixedContent[0];
      dispatch(setPlayListSongListLocalStoage(fixedContent));
      dispatch(
        setCurrentSong({
          title: title,
          playerName: playerName,
          id: _id,
          duration: convertTimeToSeconds(fixedContent[0].songDuration),
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
  }, [fixedContent]);

  useEffect(() => {
    if (songAddedByCustomer != null) {
      const storedSeconds = parseInt(currentSongSecond);
      const exists = fixedContent.some(
        (obj) => obj.title == songAddedByCustomer?.title
      );
      if (exists && storedSeconds <= 3) {
        dispatch(setCheckIsFixed(true));
      } else {
        fetchPlaylistSongList(null);
      }
    }
  }, [songAddedByCustomer]);

  useEffect(() => {
    if (checkIsFixed) {
      fetchPlaylistSongList(null);
      dispatch(setCheckIsFixed(false));
    }
  }, [fixedContent]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isUndoDisable) {
        localStorage.setItem(LAST_ACTION, null);
        setIsUndoDisable(true);
      }
    }, 30000);

    return () => clearTimeout(timeoutId);
  }, [isUndoDisable]);

  const fetchPlaylistSongList = async (firstFetch) => {
    try {
      let response = await getPlaylistSongListApi();
      const newConnection = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        autoConnect: false,
      });
      newConnection.connect();
      if (response && !response?.isError) {
        const { isFavortiteListType, isFixedItems, isNotFixed, completeList } =
          response?.data?.content;

        const playlistWithId = isNotFixed?.map((item, index) => ({
          ...item,
          id: index, // Add a unique id if it doesn't exist
        }));
        setCompleteList(completeList);
        if (completeList?.length > 0) {
          setIsFavExist(completeList?.filter((item) => item?.isFav));
        }
        setFixedContent([...isFixedItems] || []);
        setNonFixedContent([...playlistWithId] || []);
        setIsFavSongs(isFavortiteListType);
        dispatch(setPlaylistLength(isFixedItems?.length));

        // if (isFixedItems?.length > 0) {
        //   const storedSeconds = parseInt(currentSongSecond);

        //   if (!playingState && storedSeconds != 0) {
        //     dispatch(
        //       setCurrentSongSecond(
        //         convertTimeToSeconds(isFixedItems[0]?.songDuration)
        //       )
        //     );
        //   }
        // }

        newConnection.emit("insertSongIntoPlaylistRequest", {
          playlist: completeList,
          isInsert: false,
        });
      }

      // if (response && !response.isError) {
      //   let isFav = response?.data?.content?.isFavortiteListType;
      //   let songList = response?.data?.content?.playlist;
      //   dispatch(setPlaylistLength(songList?.length));
      //   const playlistWithId = songList?.map((item, index) => ({
      //     ...item,
      //     id: index, // Add a unique id if it doesn't exist
      //   }));

      //   setPlaylistSongList(playlistWithId);
      //   setIsFavSongs(isFav);
      //   if (songList?.length > 0) {
      //     setIsFavExist(songList?.filter((item) => item?.isFav));
      //   }
      //   newConnection.emit("insertSongIntoPlaylistRequest", {
      //     isFirst: firstFetch ?? isFirst,
      //     playlist: playlistWithId,
      //     isInsert: false,
      //   });
      // }
      setIsLoading(false);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  // const deleteSongFromPlaylistHandler = async (id, isTrashPress) => {
  //   dispatch(setIsAdvanceTheQueeDisable(true));

  //   let response = await deleteSongByIdApi({
  //     id: id,
  //     isDeleted: true,
  //   });
  //   dispatch(setIsAdvanceTheQueeDisable(false));
  //   if (response && !response.error) {
  //     fetchPlaylistSongList();

  //     toast(response?.data?.description);
  //   } else {
  //     toast.error(response?.data?.description || "Something Went Wrong...");
  //   }
  // };
  // const removeItemById = async (id, isTrashPress) => {
  //   let currentArray = [...nonFixedContent];
  //   await setNonFixedContent([]);
  //   currentArray = currentArray.filter((item) => item._id != id);
  //   if (currentArray?.length > 0) {
  //     setIsFavExist(currentArray?.filter((item) => item?.isFav));
  //   }
  //   let newSong;
  //   if (nonFixedContent?.length > 1) {
  //     newSong = nonFixedContent[1];
  //   }
  //   const playlistWithId = currentArray?.map((item, index) => ({
  //     ...item,
  //     id: index, // Add a unique id if it doesn't exist
  //   }));

  //   setNonFixedContent(playlistWithId);
  // };

  const deleteSongFromPlaylistHandler = async (id, isTrashPress) => {
    dispatch(setIsAdvanceTheQueeDisable(true));
    await removeItemById(id, isTrashPress);

    if (completeList?.length === 1) {
      dispatch(setCurrentSongSecond(0));
      dispatch(setSongsListUpdate());
    }
    let response = await deleteSongByIdApi({
      id: id,
      isDeleted: true,
    });
    dispatch(setIsAdvanceTheQueeDisable(false));
    if (playingState == true && !isTrashPress) {
      if (completeList?.length > 1) {
        if (initialSongPlaylist) {
          dispatch(setPlayingState(false));
        }
      }
    }
    if (response && !response.error) {
      // fetchPlaylistSongList();

      toast(response?.data?.description);
    } else {
      toast.error(response?.data?.description || "Something Went Wrong...");
    }
  };
  const removeItemById = async (id, isTrashPress) => {
    let currentArray = [...completeList];
    await setCompleteList([]);
    currentArray = currentArray.filter((item) => item._id != id);
    if (currentArray?.length > 0) {
      setIsFavExist(currentArray?.filter((item) => item?.isFav));
    }
    let newSong;
    if (nonFixedContent?.length > 1) {
      newSong = nonFixedContent[1];
    }
    const playlistWithId = currentArray?.map((item, index) => ({
      ...item,
      id: index,
      sortOrder: index,
      isFixed: index == 0 || index == 1 ? true : false,
    }));
    const tempNonFixed = playlistWithId.filter((song) => !song.isFixed);
    const tempFixed = playlistWithId.filter((song) => song.isFixed);
    setFixedContent([...tempFixed]);
    setNonFixedContent([...tempNonFixed]);
    setCompleteList(playlistWithId);
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
        playlist: [...fixedContent, ...updatedPlaylist],
      });

      setCompleteList([...fixedContent, ...updatedPlaylist]);
      setNonFixedContent([...updatedPlaylist]);

      const updatedArr = updatedPlaylist.map((item, index) => ({
        id: item._id,
        newSortOrder: fixedContent?.length + index,
        sortByMaster: item?.sortByMaster,
      }));

      updateSongsOrderHandler(updatedArr);
    }
  };
  const updateSongsOrderHandler = async (payload) => {
    try {
      const res = await updateSortOrderApi({
        songsList: payload,
      });
      toast.success(res?.data?.description);
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
    item = { ...item, sortByMaster: false };
    const response = await revertMasterCheckApi({
      item: item,
    });

    setCrownLoader(null);
    let updatedPlaylist = [...completeList];
    const updatedList = updateObjectInArray(updatedPlaylist, item);
    const newList = playlistAlgorithm(false, updatedList);
    const playlistWithId = newList?.map((item, index) => ({
      ...item,
      id: index, // Add a unique id if it doesn't exist
    }));
    setCompleteList([...playlistWithId]);

    const tempNonFixed = playlistWithId.filter((song) => !song.isFixed);
    // const tempFixed = playlistWithId.filter((song) => song.isFixed);
    // setFixedContent([...tempFixed]);
    setNonFixedContent([...tempNonFixed]);
    socket.emit("handleDragReq", {
      isFirst: false,
      playlist: newList,
    });

    toast.success(response?.data?.description);
  };

  const toggleFavSongs = async () => {
    if (!isFavSongs) {
      const tempCompleteList = [...completeList];
      let favSongsList = tempCompleteList.filter((item) => item.isFav);

      favSongsList = playlistAlgorithm(false, favSongsList);
      const playlistWithId = favSongsList?.map((item, index) => ({
        ...item,
        id: index, // Add a unique id if it doesn't exist
        isFixed: index == 0 || index == 1 ? true : false,
      }));

      const tempNonFixed = playlistWithId.filter((song) => !song.isFixed);
      const tempFixed = playlistWithId.filter((song) => song.isFixed);

      setFixedContent([...tempFixed]);
      setNonFixedContent([...tempNonFixed]);

      setCompleteList(playlistWithId);
      const initialSongDuration = convertTimeToSeconds(
        favSongsList[0].songDuration
      );
      dispatch(setCurrentSongSecond(initialSongDuration));
      socket.emit("favoriteSongReq", {
        playlist: playlistWithId,
      });
    } else {
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
      setFixedContent([]);
      setNonFixedContent([]);
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
          is,
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

  const handleUpdateItem = (updatedItem) => {
    setNonFixedContent((prevItems) =>
      prevItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  const [height, setHeight] = useState("h-[50vh]");
  const [emptyListHeight, setEmptyListHeight] = useState("h-[80vh]");
  useEffect(() => {
    const updateHeight = () => {
      if (window.innerHeight <= 750) {
        setHeight("h-[27vh]");
      } else if (window.innerHeight > 750 && window.innerHeight <= 920) {
        setHeight("h-[28vh]");
      } else {
        setHeight("h-[50vh]");
      }
    };

    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight); // Update on resize

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="h-full py-5 flex flex-col">
      {isLoading ? (
        <CustomLoader />
      ) : (
        <div className="flex-1 relative h-full ">
          <div
            className={`flex items-center ${
              fixedContent?.length > 0 ? "justify-between" : "justify-end"
            } mx-1`}
          >
            {(fixedContent?.length > 0 || nonFixedContent?.length > 0) && (
              <button
                onClick={async () => {
                  await deleteSongFromPlaylistHandler(
                    fixedContent[0]?._id,
                    false,
                    true
                  );
                }}
                className="flex items-center bg-black hover:bg-primary hover:text-black text-white font-bold py-3 px-4 lg:text-lg justify-center rounded-lg disabled:bg-gray-400 hover:cursor-pointer"
              >
                <span className="mr-2">Advance the Queue</span>
                <FaForward />
              </button>
            )}
            <div className="flex flex-row">
              {!isFavSongs &&
                (fixedContent?.length > 0 || nonFixedContent?.length > 0) && (
                  <button
                    className="border-black border rounded p-3 flex-grow-0 mr-2 text-black transition-transform transform hover:scale-105"
                    onClick={() => setIsConfirmationPopup(true)}
                  >
                    <span className="flex items-center">
                      <TbMusicX className="mr-2" />
                      Clear Songs
                    </span>
                  </button>
                )}
              {isFavExist?.length > 0 &&
                (isFavSongs ||
                  fixedContent?.length > 0 ||
                  nonFixedContent?.length > 0) && (
                  <button
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
                      {isFavSongs ? "Back to Playlist" : "Play Favorite Songs"}
                    </span>
                  </button>
                )}
            </div>
          </div>

          {fixedContent?.length === 0 &&
            nonFixedContent?.length === 0 &&
            !getPlaylistSongListResponse.isFetching && (
              <div className="flex items-center justify-center flex-1 h-full">
                <span className="text-black font-semibold">
                  Currently, there are no songs available in the playlist
                </span>
              </div>
            )}

          {fixedContent?.length > 0 && (
            <div className="text-base font-medium text-black text-center flex mt-10 mb-5 px-5">
              <div className="w-1/12"></div>
              <div className="w-2/12">Title</div>
              <div className="w-1/12"></div>
              <div className="w-3/12">Player</div>
              <div className="w-2/12">Intro</div>
              <div className="w-2/12">Category</div>
              <div className="w-1/12"></div>
            </div>
          )}

          {fixedContent?.map((item, index) => {
            const {
              title,
              playerName,
              introSec,
              category,
              isFav,
              songDuration,
            } = item || {};

            return (
              <div
                key={index}
                className="text-center bg-top-queue-bg shadow rounded-2xl h-20 flex items-center px-5 mb-3"
              >
                <div className="w-1/12 text-start font-extrabold text-lg">
                  <div className="flex items-center justify-center cursor-pointer">
                    {index + 1}
                  </div>
                </div>
                <div className="w-2/12 pr-10">
                  <EllipsisText text={title} length={15} />
                </div>
                <div className="w-1/12"></div>
                <div className="w-3/12">{playerName}</div>

                <div className="w-2/12 flex items-center justify-center">
                  <div className="bg-white shadow flex items-center justify-center mt-2 h-10 w-10 rounded-full">
                    {introSec || 0}
                  </div>
                </div>
                <div className="w-2/12 flex items-center justify-center">
                  <div
                    className={`${
                      index > 1 ? "bg-[#F7F7F7]" : "bg-white"
                    } rounded-3xl px-5 py-2`}
                  >
                    {category}
                  </div>
                </div>
                <div className="w-1/12">
                  <div className="flex items-center justify-end">
                    {index === 0 && (
                      <SongCountdownTimer
                        orignalSongDuration={songDuration}
                        duration={currentSongSecond}
                        advanceTheQueue={() => {
                          deleteSongFromPlaylistHandler(fixedContent[0]?._id);
                        }}
                        playlistSongList={fixedContent}
                        isStart={playingState}
                      />
                    )}
                    {isFav && <FaHeart className="text-primary" size={20} />}
                  </div>
                </div>
              </div>
            );
          })}

          <div
            id="scrollableContainer"
            ref={containerRef}
            className="overflow-y-auto h-[calc(100vh-490px)]"
          >
            <DraggableList
              unsetZIndex={true}
              itemKey="id"
              template={({ item, itemSelected, dragHandleProps }) => {
                return (
                  <PlaylistSongItemV2
                    item={item}
                    itemSelected={itemSelected}
                    dragHandleProps={dragHandleProps}
                    playlistSongList={nonFixedContent}
                    revertCrownhandler={revertCrownhandler}
                    deleteSongFromPlaylistHandler={
                      deleteSongFromPlaylistHandler
                    }
                    socket={socket}
                    loading={crownLoader}
                    setLoader={setCrownLoader}
                    fetchSongsList={fetchPlaylistSongList}
                    onUpdateItem={handleUpdateItem}
                  />
                );
              }}
              list={nonFixedContent}
              onMoveEnd={(newList, movedItem, oldIndex, newIndex) => {
                // if (oldIndex != 0 && oldIndex != 1) {
                //   if (newIndex != 0 && newIndex != 1) {
                handleDragEnd(newList, oldIndex, newIndex, movedItem);
                // }
                // }
              }}
              container={() => containerRef.current}
            />
          </div>

          {!isFavSongs && (
            <div className="sticky bottom-0 w-full flex z-10 items-center justify-center bg-[#fafafa] gap-3">
              <button
                onClick={() => setSelectSongModal(true)}
                className="flex w-full items-center bg-top-queue-bg hover:bg-yellow-500 hover:text-black text-black font-bold py-3 px-4 rounded-md justify-center"
              >
                + Add a Song
              </button>
              <button
                disabled={isUndoDisable}
                onClick={onUndoPressHandler}
                className={`w-full shadow-md text-base flex items-center bg-white ${
                  isUndoDisable &&
                  "bg-slate-200 cursor-not-allowed text-slate-400"
                } text-black font-bold py-3 px-4 rounded-md justify-center ${
                  !isUndoDisable && "hover:bg-active-tab"
                }`}
              >
                <IoArrowUndo />
                <span className="ml-2">Undo Action</span>
              </button>
            </div>
          )}
          {selectSongModal && (
            <SelectSongModal
              onReload={() => setIsLoading(true)}
              btnText="Add"
              title="Select songs"
              openModal={selectSongModal}
              fetchList={fetchPlaylistSongList}
              closeModal={() => setSelectSongModal(false)}
            />
          )}
          {isConfirmationPopup && (
            <ConfirmationPopup
              isLoading={deleteAllSongsResponse?.isLoading}
              title="Are you sure to remove all songs from playlist?"
              onYesPress={deleteAllSongsHandler}
              closeModal={() => setIsConfirmationPopup(false)}
              openModal={isConfirmationPopup}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default page;
