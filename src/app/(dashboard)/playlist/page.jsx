"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaForward, FaHeart } from "react-icons/fa";
import { TbMusicX } from "react-icons/tb";
import { IoArrowBackOutline } from "react-icons/io5";
import { SelectSongModal, SongCountdownTimer } from "../../_components";
import {
  useUpdatePlaylistTypeMutation,
  // useLazyGetSongsFromPlaylistV2Query,
  useDeleteSongFromPlaylistByIdV2Mutation,
  useDeleteAllSongsFromPlaylistV2Mutation,
  useRevertMasterCheckV2Mutation,
  useUpdateSortOrderOfSongsV2Mutation,
  // useLazyGetAddSongListForCustomerV2Query,
  // useAddMultiSongToPlaylistV2Mutation,
  // useLazyGetAddEvenSongsToPlaylistQuery,
  useGetSongsFromPlaylistV2Mutation,
  useRemoveDuplicateSongsFromPlaylistMutation,
  useAddEvenSongsToPlaylistMutation,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
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
} from "@/app/_utils/redux/slice/playlist-list";
import { useSelector } from "react-redux";
import { convertTimeToSeconds, useOnlineStatus } from "../../_utils/helper";
import ConfirmationPopup from "@/app/_components/confirmation-popup";
import { playlistAlgorithmV2 } from "../../../../backend/algorithm/playlistAlgo";
import { CustomLoader } from "@/app/_components/custom_loader";
import DraggableList from "react-draggable-list";
import { PlaylistSongItemV2 } from "./songItem";
import { EllipsisText } from "@/app/_components/ellipsis-text";
import { FaSync } from "react-icons/fa";

const page = () => {
  const containerRef = useRef();
  const dispatch = useDispatch();
  const isOnline = useOnlineStatus();
  const [getPlaylistSongListApi, getPlaylistSongListResponse] =
    useGetSongsFromPlaylistV2Mutation();
  const [fixedContent, setFixedContent] = useState([]);
  const [nonFixedContent, setNonFixedContent] = useState([]);
  const [completeList, setCompleteList] = useState([]);
  const [deleteAllSongsApi, deleteAllSongsResponse] =
    useDeleteAllSongsFromPlaylistV2Mutation();
  const [updatePlaylistTypeAPI] = useUpdatePlaylistTypeMutation();
  const [updateSortOrderApi] = useUpdateSortOrderOfSongsV2Mutation();
  const [revertMasterCheckApi] = useRevertMasterCheckV2Mutation();
  const [deleteSongByIdApi] = useDeleteSongFromPlaylistByIdV2Mutation();
  // const [songsListApi] = useLazyGetAddSongListForCustomerV2Query();
  // const [addMultiSongsApi] = useAddMultiSongToPlaylistV2Mutation();
  const [addMultipleSongsApi] = useAddEvenSongsToPlaylistMutation();
  const [removeDuplicateSongApi] =
    useRemoveDuplicateSongsFromPlaylistMutation();
  const [isFavSongs, setIsFavSongs] = useState(false);
  const [socket, setSocket] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationPopup, setIsConfirmationPopup] = useState(false);
  const [isFavExist, setIsFavExist] = useState([]);
  // const [votingList, setVotingList] = useState(null);
  const [crownLoader, setCrownLoader] = useState(null);
  const [selectSongModal, setSelectSongModal] = useState(false);
  const [isAdvanceButtonDisable, setIsAdvanceButtonDisable] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const playingState = useSelector(
    (state) => state?.playlistReducer?.playingState
  );
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );

  const currentSongSecond = useSelector(
    (state) => state?.playlistReducer?.currentSongSecond
  );
  const currentSong = useSelector(
    (state) => state?.playlistReducer?.currentSong
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

      fetchPlaylistSongList(true); // Cleanup socket connection

      return () => {
        socket.disconnect();
      };
    }
  }, [isOnline]);
  let timer;

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();
    setSocket(socket);

    socket.on("emptyPlaylistResponse-v2", (item) => {
      fetchPlaylistSongList(true);
      dispatch(setPlaylistLength(0));
      dispatch(setCurrentSongSecond(0));
      dispatch(setPlayingState(false));
    });
    socket.on("voteCastingResponse-v2", (item) => {
      // setVotingList(item || {});

      clearTimeout(timer); // Clear previous timeout

      timer = setTimeout(() => {
        setCounter((prev) => prev + 1);
      }, 1000);
    });
    socket.on("songAddByCustomerRes-v2", (item) => {
      // setCounter((prev) => prev + 1);
      clearTimeout(timer); // Clear previous timeout

      timer = setTimeout(() => {
        setCounter((prev) => prev + 1);
      }, 700);
    });

    socket.on("RemoveSongFromPlaylistResponse-v2", (item) => {
      fetchPlaylistSongList(true);
    });

    socket.on("disconnect", async (reason) => {
      console.log(`Socket disconnected socket connection test: ${reason}`);
      await fetchPlaylistSongList(true);
    });

    return () => {
      clearTimeout(timer); // Cleanup the timeout if the component is unmounted
    };
  }, []);

  // useEffect(() => {
  //   if (votingList != null) {
  //     fetchPlaylistSongList(true);
  //   }
  // }, [votingList]);

  // Add signal to buffer and trigger debounce logic

  useEffect(() => {
    if (counter > 0) {
      fetchPlaylistSongList();
    }
  }, [counter]);

  useEffect(() => {
    if (fixedContent?.length != 0 && fixedContent?.length != 2) {
      fetchPlaylistSongList(true);
    }
  }, [fixedContent]);

  useEffect(() => {
    if (nonFixedContent?.length > 0) {
      // Filter to include only songs with requestToPerform === false
      const filteredContent = nonFixedContent.filter(
        (item) => !item.requestToPerform
      );

      // Map the filtered content to an array of songId
      const valueArr = filteredContent.map((item) => item.songId);

      // Check for duplicates in the filtered array
      const isDuplicate = valueArr.some(
        (item, idx) => valueArr.indexOf(item) !== idx
      );

      if (isDuplicate) {
        removeDuplicateApiHandler();
      }

      console.log(
        "Is there a duplicate songId for requestToPerform === false?",
        isDuplicate
      );
    }
  }, [nonFixedContent]);

  const removeDuplicateApiHandler = async () => {
    const response = await removeDuplicateSongApi();
    if (response && !response?.isError) {
      const {
        isFavortiteListType,
        isFixedItems,
        isNotFixed,
        completeList: fullList,
      } = response?.data?.content;

      const playlistWithId = isNotFixed?.map((item, index) => ({
        ...item,
        id: index, // Add a unique id if it doesn't exist
      }));
      setCompleteList(fullList);
      if (completeList?.length > 0) {
        setIsFavExist(completeList?.filter((item) => item?.isFav));
      }
      setNonFixedContent(playlistWithId || []);
      setIsFavSongs(isFavortiteListType);
      socket.emit("insertSongIntoPlaylistRequest-v2", {
        playlist: fullList,
        isInsert: false,
      });
    }
  };

  const addMultipleSongsApiHandler = async (socket) => {
    const response = await addMultipleSongsApi();

    if (response && !response?.isError) {
      const {
        isFavortiteListType,
        isFixedItems,
        isNotFixed,
        completeList: fullList,
      } = response?.data?.content;

      const playlistWithId = isNotFixed?.map((item, index) => ({
        ...item,
        id: index, // Add a unique id if it doesn't exist
      }));
      setCompleteList(fullList);
      if (completeList?.length > 0) {
        setIsFavExist(completeList?.filter((item) => item?.isFav));
      }
      setNonFixedContent(playlistWithId || []);
      setIsFavSongs(isFavortiteListType);
      socket.emit("insertSongIntoPlaylistRequest-v2", {
        playlist: fullList,
        isInsert: false,
      });
    }
  };

  const fetchPlaylistSongList = async (shouldCalled) => {
    console.log("==>", "called");
    if (isRequestInProgress) {
      return;
    }

    if (counter <= 0 && !shouldCalled) {
      console.log("No more requests to process.");
      return;
    }

    setIsRequestInProgress(true);

    try {
      let response = await getPlaylistSongListApi();
      const newConnection = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        autoConnect: false,
      });
      newConnection.connect();
      if (response && !response?.isError) {
        const {
          isFavortiteListType,
          isFixedItems,
          isNotFixed,
          completeList: fulllist,
        } = response?.data?.content;

        const playlistWithId = isNotFixed?.map((item, index) => ({
          ...item,
          id: index, // Add a unique id if it doesn't exist
        }));
        setCompleteList(fulllist);

        if (fulllist?.length > 1 && fulllist?.length < 30) {
          addMultipleSongsApiHandler(newConnection);
        }
        if (fulllist?.length > 0) {
          setIsFavExist(fulllist?.filter((item) => item?.isFav));
        }

        if (
          isFixedItems?.length > 0 &&
          currentSong?.title == "" &&
          currentSongSecond == 0
        ) {
          const { playerName, title, _id } = isFixedItems[0];

          dispatch(
            setCurrentSong({
              title: title,
              player: playerName,
              id: _id,
              duration: convertTimeToSeconds(isFixedItems[0].songDuration),
            })
          );
          dispatch(
            setCurrentSongSecond(
              convertTimeToSeconds(isFixedItems[0].songDuration)
            )
          );
        }
        setFixedContent([...isFixedItems] || []);
        setNonFixedContent([...playlistWithId] || []);
        setIsFavSongs(isFavortiteListType);
        dispatch(setPlaylistLength(isFixedItems?.length));
        newConnection.emit("insertSongIntoPlaylistRequest-v2", {
          playlist: fulllist,
          isInsert: false,
        });
      }

      setIsAdvanceButtonDisable(false);
      setIsSyncing(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setIsRequestInProgress(false); // Unlock after request completion
      if (counter > 0) {
        setCounter((prev) => prev - 1); // Decrement the counter
      }
    }
  };

  const deleteSongFromPlaylistHandler = async (id, isTrashPress, hideSong) => {
    setIsAdvanceButtonDisable(true);
    dispatch(setIsAdvanceTheQueeDisable(true));
    const res = await removeItemById(id, isTrashPress);

    if (completeList?.length === 1) {
      dispatch(setCurrentSongSecond(0));
      dispatch(setSongsListUpdate());
    }
    socket.emit("removeReq-v2", {
      isFirst: false,
      playlist: res,
      time: 10,
    });
    let response = await deleteSongByIdApi({
      id: id,
      isDeleted: true,
      auto: isTrashPress,
      hideSong: hideSong,
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
      toast(response?.data?.description);
    } else {
      toast.error(response?.data?.description || "Something Went Wrong...");
    }
    // socket.emit("removeReq-v2", {
    //   isFirst: false,
    //   playlist: res,
    //   time: 10,
    // });
    fetchPlaylistSongList(true);
    // if (completeList?.length != 0 && completeList?.length < 30) {
    //   await fetchSongsList(res);
    // } else {

    // }
  };
  const removeItemById = async (id, isTrashPress) => {
    let currentArray = [...completeList];
    await setCompleteList([]);
    currentArray = currentArray.filter((item) => item._id != id);
    if (currentArray?.length > 0) {
      setIsFavExist(currentArray?.filter((item) => item?.isFav));
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

    if (!isTrashPress && tempFixed?.length > 0) {
      dispatch(
        setCurrentSongSecond(convertTimeToSeconds(tempFixed[0]?.songDuration))
      );
      const { playerName, title, _id } = tempFixed[0];

      await dispatch(
        setCurrentSong({
          title: title,
          player: playerName,
          id: _id,
          duration: setCurrentSongSecond(
            convertTimeToSeconds(tempFixed[0]?.songDuration)
          ),
        })
      );
    } else {
      localStorage.setItem("isRequestInProgress", false);
      setIsLoading(true);
      // dispatch(setCurrentSongSecond(0));
      // dispatch(
      //   setCurrentSong({
      //     title: "",
      //     player: "",
      //     id: 0,
      //     duration: 0,
      //   })
      // );
    }
    return playlistWithId;
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

      socket.emit("handleDragReq-v2", {
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
    const newList = playlistAlgorithmV2(false, updatedList);

    const playlistWithId = newList?.map((item, index) => ({
      ...item,
      id: index, // Add a unique id if it doesn't exist
    }));
    setCompleteList([...playlistWithId]);

    const tempNonFixed = playlistWithId.filter((song) => !song.isFixed);
    setNonFixedContent([...tempNonFixed]);
    socket.emit("handleDragReq-v2", {
      isFirst: false,
      playlist: newList,
    });

    toast.success(response?.data?.description);
  };

  const toggleFavSongs = async () => {
    if (!isFavSongs) {
      const tempCompleteList = [...completeList];
      let favSongsList = tempCompleteList.filter((item) => item.isFav);

      favSongsList = playlistAlgorithmV2(false, favSongsList);
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
      socket.emit("favoriteSongReq-v2", {
        playlist: playlistWithId,
      });
    } else {
      setIsLoading(true);
      fetchPlaylistSongList(true);
    }
    setIsFavSongs(!isFavSongs);
    await updatePlaylistTypeAPI({
      isFavortiteListType: !isFavSongs,
    });
  };

  const deleteAllSongsHandler = async () => {
    localStorage.setItem("isRequestInProgress", false);
    dispatch(setPlayingState(false));
    localStorage.setItem("isFirstTimeFetched", true);
    dispatch(setInitialSongPlaylist(true));
    dispatch(setCurrentSongSecond(0));
    dispatch(setSongsListUpdate());
    dispatch(setPlaylistLength(0));
    dispatch(
      setCurrentSong({
        title: "",
        player: "",
        id: 0,
        duration: 0,
      })
    );
    let response = await deleteAllSongsApi();
    if (response && !response.error) {
      setIsConfirmationPopup(false);
      toast.success(response?.data?.description);
      dispatch(setCurrentSongSecond(0));
      dispatch(setSongsListUpdate());
      dispatch(setPlayingState(false));
      dispatch(setSongsListUpdate());
      setIsLoading(true);
      setFixedContent([]);
      setNonFixedContent([]);
      socket.emit("emptyPlaylistRequest-v2", {
        isFirst: true,
        playlist: [],
      });
    }
  };

  const handleUpdateItem = (updatedItem) => {
    setNonFixedContent((prevItems) =>
      prevItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };
  const [isSyncing, setIsSyncing] = useState(false);
  const handleSync = () => {
    setIsSyncing(true);

    fetchPlaylistSongList(true);
  };

  return (
    <div className="h-full py-5 flex flex-col">
      {isLoading ? (
        <CustomLoader bgColor={masterViewTheme ? "bg-dark" : "bg-light"} />
      ) : (
        <div className="flex-1 relative h-full ">
          <div
            className={`flex items-center ${
              fixedContent?.length > 0 ? "justify-between" : "justify-end"
            } mx-1`}
          >
            {(fixedContent?.length > 0 || nonFixedContent?.length > 0) && (
              <div className=" flex items-center justify-center gap-3">
                <button
                  disabled={isAdvanceButtonDisable}
                  onClick={async () => {
                    await deleteSongFromPlaylistHandler(
                      fixedContent[0]?._id,
                      false,
                      true
                    );
                  }}
                  className={`flex items-center ${masterViewTheme ? "bg-black  " : "bg-light-tile"}  text-white hover:bg-primary hover:text-black font-bold py-3 px-4 lg:text-lg justify-center rounded-lg disabled:bg-gray-400 hover:cursor-pointer`}
                >
                  <span className="mr-2">Advance the Queue</span>
                  <FaForward />
                </button>

                <button
                  onClick={handleSync}
                  className={`flex items-center ${masterViewTheme ? "bg-black  " : "bg-light-tile"}  text-white hover:bg-primary hover:text-black font-bold py-3 px-4 lg:text-lg justify-center rounded-lg disabled:bg-gray-400 hover:cursor-pointer`}
                  disabled={isSyncing}
                >
                  <span className="mr-2">
                    {isSyncing ? "Syncing..." : "Sync"}
                  </span>
                  <FaSync className={isSyncing ? "animate-spin" : ""} />
                </button>
              </div>
            )}
            <div className="flex flex-row">
              {!isFavSongs &&
                (fixedContent?.length > 0 || nonFixedContent?.length > 0) && (
                  <button
                    className={`${masterViewTheme ? "  text-black" : " bg-light-tile text-white"} border-black border rounded p-3 flex-grow-0 mr-2  transition-transform transform hover:scale-105 disabled:bg-gray-400`}
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
                    disabled={playingState}
                    onClick={toggleFavSongs}
                    className={`flex items-center hover:cursor-pointer border border-black ${
                      !isFavSongs
                        ? `${masterViewTheme ? " text-black" : "bg-light-tile text-white"} `
                        : "border-top-queue-bg"
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
              <div className="flex items-center justify-center h-[calc(100vh-170px)] ">
                <span
                  className={`${masterViewTheme ? "text-black" : "text-white"}  font-semibold`}
                >
                  Currently, there are no songs available in the playlist
                </span>
              </div>
            )}

          {fixedContent?.length > 0 && (
            <div
              className={`text-base font-medium ${!masterViewTheme ? "text-white" : "text-black"} text-center flex mt-10 mb-5 px-5`}
            >
              <div className="w-1/12"></div>
              <div className="w-2/12">Title</div>
              <div className="w-1/12"></div>
              <div className="w-3/12">Player</div>
              <div className="w-2/12">Location</div>
              <div className="w-2/12">Category</div>
              <div className="w-1/12"></div>
            </div>
          )}

          {fixedContent?.map((item, index) => {
            const {
              title,
              playerName,
              introSec,
              location,
              category,
              isFav,
              songDuration,
              tableNo,
              requestToPerform,
            } = item || {};

            return (
              <div
                key={index}
                className={`text-center ${requestToPerform ? "bg-gray-tile" : "bg-top-queue-bg"} shadow rounded-2xl h-20 flex items-center px-5 mb-3`}
              >
                <div className="w-1/12 text-start font-extrabold text-lg">
                  <div className="flex items-center justify-center cursor-pointer">
                    {index + 1}
                  </div>
                </div>
                <div className="w-2/12 pr-10">
                  <EllipsisText text={title} isFixed={true} length={15} />
                </div>
                <div className="w-1/12"></div>
                <div className="w-3/12">
                  {playerName != "undefined undefined" ? (
                    playerName
                  ) : (
                    <div className="  flex items-center justify-center">
                      <div className="px-2 py-1 bg-black rounded-full text-white">
                        Table {tableNo}
                      </div>
                    </div>
                  )}

                  {}
                </div>

                <div className="w-2/12 flex items-center justify-center">
                  <div className={`bg-[#F7F7F7] rounded-3xl px-5 py-2`}>
                    {location || introSec}
                  </div>
                </div>
                <div className="w-2/12 flex items-center justify-center">
                  <div className={`bg-[#F7F7F7] rounded-3xl px-5 py-2`}>
                    {category}
                  </div>
                </div>
                <div className="w-1/12">
                  <div className="flex items-center justify-end">
                    {index === 0 && (
                      <SongCountdownTimer
                        socket={socket}
                        orignalSongDuration={songDuration}
                        duration={currentSongSecond}
                        advanceTheQueue={() => {
                          deleteSongFromPlaylistHandler(
                            fixedContent[0]?._id,
                            false,
                            true
                          );
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
          {(nonFixedContent?.length > 0 || fixedContent?.length > 0) && (
            <div
              id="scrollableContainer"
              ref={containerRef}
              className={`overflow-y-auto ${
                fixedContent?.length > 1
                  ? "h-[calc(100vh-490px)]"
                  : "h-[calc(100vh-400px)]"
              }`}
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
          )}
          {!isFavSongs && (
            <div className="sticky bottom-0 w-full flex z-10 items-center justify-center bg-[#fafafa] gap-3 rounded-md">
              <button
                onClick={() => setSelectSongModal(true)}
                className="flex w-full items-center bg-top-queue-bg hover:bg-yellow-500 hover:text-black text-black font-bold py-3 px-4 rounded-md justify-center"
              >
                + Add a Song
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
