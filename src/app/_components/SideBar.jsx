"use client";
import Link from "next/link";
import { navlinks } from "./pathname";
import { IoPlaySharp, IoPause } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { HiMusicNote } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setCurrentSong,
  setCurrentSongSecond,
  setIsAdvanceTheQueeDisable,
  setPlayingState,
  setPlaylistSongList,
  setSongsListUpdate,
} from "../_utils/redux/slice/playlist-list";
import { convertTimeToSeconds, formatTime } from "../_utils/helper";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useDeleteSongFromPlaylistByIdMutation } from "../_utils/redux/slice/emptySplitApi";

const SideBar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [socket, setSocket] = useState({});

  const playingState = useSelector(
    (state) => state?.playlistReducer?.playingState
  );

  const playlistLength = useSelector(
    (state) => state?.playlistReducer?.playlistLength
  );

  const currentSong = useSelector(
    (state) => state?.playlistReducer?.currentSong
  );

  const playlistSongList = useSelector(
    (state) => state?.playlistReducer?.playlistSongList
  );
  const currentSongSecond = useSelector(
    (state) => state?.playlistReducer?.currentSongSecond
  );
  const initialSongPlaylist_ = useSelector(
    (state) => state?.playlistReducer?.initialSongPlaylist
  );
  const initialSongPlaylist = JSON.parse(initialSongPlaylist_);
  const [deleteSongByIdApi] = useDeleteSongFromPlaylistByIdMutation();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();
    setSocket(socket);
  }, []);

  const deleteSongFromPlaylistHandler = async (id) => {
    if (id) {
      if (playlistSongList?.length === 1) {
        dispatch(setCurrentSongSecond(0));
      }
      let response = await deleteSongByIdApi({
        id: id,
        isDeleted: true,
      });
      socket.emit("addSongToPlaylistApi", {
        id: id,
        isFirst: false,
      });
      if (response && !response.error) {
        const index = playlistSongList.findIndex(
          (i) => i._id == currentSong.id
        );

        if (playlistSongList?.length > 1) {
          const { playerName, title, _id } = playlistSongList[index + 1];
          dispatch(setPlaylistSongList(playlistSongList));
          dispatch(
            setCurrentSong({
              title: title,
              playerName: playerName,
              id: _id,
              duration: convertTimeToSeconds(
                playlistSongList[index + 1].songDuration
              ),
            })
          );

          const songDuration = convertTimeToSeconds(
            playlistSongList[index + 1].songDuration
          );
          if (playlistSongList?.length === index + 1) {
          }

          dispatch(setCurrentSongSecond(songDuration));
        } else {
          dispatch(setCurrentSongSecond(0));
          dispatch(setPlayingState(false));
        }
        dispatch(setSongsListUpdate());
      } else {
        toast.error(response?.data?.description || "Something Went Wrong...");
      }
    }
  };

  let intervalId = 0;
  useEffect(() => {
    // RetrieveTIMERvalue from localStorage on component mount
    if (pathname != "/playlist") {
      if (parseInt(currentSongSecond) === 0) {
        deleteSongFromPlaylistHandler(currentSong.id);
      }
      if (currentSongSecond) {
        dispatch(setCurrentSongSecond(parseInt(currentSongSecond)));
      } else {
        dispatch(setCurrentSongSecond(0));
      }

      if (playingState) {
        intervalId = setInterval(() => {
          if (currentSongSecond > 0) {
            dispatch(setCurrentSongSecond((currentSongSecond - 1).toString()));
          } else {
            clearInterval(intervalId);
          }
        }, 1000);
      } else {
        clearInterval(intervalId);
      }
    }
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [currentSongSecond, playingState, pathname]); // Re-run useEffect when secondsRemaining changes

  const changePlayingState = () => {
    dispatch(setPlayingState(!playingState));
    dispatch(setIsAdvanceTheQueeDisable(false));
    // socket.emit("startIntroSecondsRequest", {
    //   time: 10,
    // });
  };

  const startTimer = () => {
    if (currentSong?.duration == currentSongSecond) {
      socket.emit("bufferTimeReq", {
        time: 10,
      });
      dispatch(setIsAdvanceTheQueeDisable(true));

      if (initialSongPlaylist) {
        setTimeout(() => {
          changePlayingState();
        }, 10000);
      } else {
        changePlayingState();
      }

      // setTimeout(() => {
      //   socket.emit("startIntroSecondsRequest", {
      //     time: 10,
      //   });
      //   dispatch(setIsAdvanceTheQueeDisable(false));
      //   dispatch(setPlayingState(!playingState));
      // }, 10000);
    } else {
      dispatch(setPlayingState(!playingState));
    }
  };

  return (
    <>
      <div className=" drop-shadow-lg  lg:block md:block hidden bg-white relative  rounded-3xl mr-5 w-1/6 ">
        <ul className="p-4 flex-col w-full">
          <div className="flex  items-center justify-center">
            <Link href={"/players"} className="hover:cursor-pointer">
              <img src="/assets/logo.png" className="h-10  my-5 " />
            </Link>
          </div>
          {navlinks.map((i, index) => {
            const isActive = pathname?.startsWith(i.href);
            return (
              <Link key={index} href={i.href}>
                <li
                  className={`${
                    isActive
                      ? "bg-[#FEF9EB]  border border-top-queue-bg "
                      : "my-5 "
                  }  hover:cursor-pointer hover:bg-[#FEF9EB] rounded-xl lg:p-4 p-2 my-3`}
                >
                  <div className={`flex justify-start items-center`}>
                    <div className="w-[23px]">{i.icon(isActive)}</div>
                    <div
                      className={`lg:ml-10 ml-2 mr-3 m lg:text-base text-sm ${
                        isActive ? "text-top-queue-bg" : "text-black "
                      }`}
                    >
                      {i.name}
                    </div>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
        {pathname != "/playlist" && playlistLength > 0 && (
          <div className=" absolute bottom-0  p-4  w-full ">
            <span className="text-black font-semibold text-lg">
              Current Song
            </span>
            <div className="bg-primary rounded-lg mt-2 p-4">
              <div className="flex items-center ">
                <div className="rounded-full p-1 flex items-center justify-center  h-8 w-8   bg-black ">
                  <HiMusicNote color="white" size={20} />
                </div>
                <div className="text-black flex flex-col ml-3 ">
                  <span className="font-semibold">{currentSong.title} </span>
                  <span className="font-normal">{currentSong.playerName}</span>
                </div>
              </div>
              {/* <div className="p-2 mt-5 rounded-full bg-[#F7F7F7] flex justify-center items-center">
                <button
                  onClick={() => startTimer()}
                  className="h-8 w-8 bg-white shadow-xl rounded-full flex items-center justify-center mr-2 "
                >
                  {playingState ? <IoPause /> : <IoPlaySharp />}
                </button>
                <span>{formatTime(currentSongSecond)}</span>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SideBar;
