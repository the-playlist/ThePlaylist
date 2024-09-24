"use client";
import {
  setCurrentSongSecond,
  setInitialSongPlaylist,
  setPlayingState,
  setSongsListUpdate,
} from "@/app/_utils/redux/slice/playlist-list";
import { useEffect } from "react";
import { IoPlaySharp, IoPause } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { convertTimeToSeconds, formatTime } from "../../_utils/helper";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SongCountdownTimer = ({
  advanceTheQueue,
  playlistSongList,
  isStart,
  orignalSongDuration,
}) => {
  let timer;
  const dispatch = useDispatch();

  const duration = useSelector(
    (state) => state?.playlistReducer?.currentSongSecond
  );
  const playingState = useSelector(
    (state) => state?.playlistReducer?.playingState
  );
  const initialSongPlaylist_ = useSelector(
    (state) => state?.playlistReducer?.initialSongPlaylist
  );
  const initialSongPlaylist = JSON.parse(initialSongPlaylist_);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();
    if (isStart) {
      if (duration == 0) {
        clearInterval(timer);
        handleTimeZero();
        return;
      }
      timer = setInterval(() => {
        const remainingTime = parseInt(duration) - 1;
        dispatch(setCurrentSongSecond(remainingTime));
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isStart, duration, playlistSongList[0]?._id]);

  const handleTimeZero = () => {
    if (playlistSongList?.length > 1) {
      const songDuration = convertTimeToSeconds(
        playlistSongList[1]?.songDuration
      );
      dispatch(setCurrentSongSecond(songDuration));
    } else {
      dispatch(setCurrentSongSecond(0));
      dispatch(setPlayingState(false));
    }
    dispatch(setSongsListUpdate());
    advanceTheQueue(playlistSongList[0]?._id);
  };

  const changePlayingState = () => {
    dispatch(setPlayingState(true));
  };

  useEffect(() => {
    const orignalSeconds = convertTimeToSeconds(orignalSongDuration);
    if (orignalSeconds == duration && playingState) {
      dispatch(setPlayingState(false));

      if (initialSongPlaylist) {
        changePlayingState();
      } else {
        changePlayingState();
      }
    } else {
    }
  }, [orignalSongDuration]);

  const startTimer = () => {
    dispatch(setInitialSongPlaylist(false));
    const orignalSeconds = convertTimeToSeconds(orignalSongDuration);
    if (orignalSeconds == duration) {
      if (initialSongPlaylist) {
        changePlayingState();
      } else {
        changePlayingState();
      }
    } else {
      dispatch(setPlayingState(true));
    }
  };

  const pauseTimer = () => {
    dispatch(setPlayingState(false));
  };

  return (
    <div className="flex items-center justify-end mr-2 ">
      <div className="bg-[#F7F7F7] flex items-center  justify-center px-3 py-2 rounded-3xl">
        <button
          onClick={() => {
            isStart ? pauseTimer() : startTimer();
          }}
          className="h-8 w-8 bg-white shadow-xl rounded-full flex items-center justify-center mr-2 "
        >
          {isStart ? <IoPause /> : <IoPlaySharp />}
        </button>
        {formatTime(duration)}
      </div>
    </div>
  );
};
export default SongCountdownTimer;
