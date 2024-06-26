"use client";
import {
  setCurrentSongSecond,
  setPlayingState,
  setSongsListUpdate,
} from "@/app/_utils/redux/slice/playlist-list";
import { useEffect } from "react";
import { IoPlaySharp, IoPause } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { convertTimeToSeconds, formatTime } from "../../_utils/helper";
import { useSelector } from "react-redux";

const SongCountdownTimer = ({
  advanceTheQueue,
  playlistSongList,
  isStart,
  setShowCountDown,
  orignalSongDuration,
  socket,
}) => {
  let timer;
  const dispatch = useDispatch();

  const duration = useSelector(
    (state) => state?.playlistReducer?.currentSongSecond
  );
  const playingState = useSelector(
    (state) => state?.playlistReducer?.playingState
  );

  useEffect(() => {
    if (isStart) {
      if (duration == 0) {
        clearInterval(timer);
        handleTimeZero();
        return;
      }
      timer = setInterval(() => {
        dispatch(setCurrentSongSecond(parseInt(duration) - 1));
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isStart, duration, playlistSongList[0]?._id]);

  const handleTimeZero = () => {
    if (playlistSongList.length > 1) {
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

  useEffect(() => {
    const orignalSeconds = convertTimeToSeconds(orignalSongDuration);
    if (orignalSeconds == duration && playingState) {
      dispatch(setPlayingState(false));
      setShowCountDown(true);
      socket.emit("bufferTimeReq", {
        time: 10,
      });
      setTimeout(() => {
        dispatch(setPlayingState(true));
        socket.emit("startIntroSecondsRequest", {
          time: 10,
        });
      }, 10000);
    } else {
    }
  }, [orignalSongDuration]);

  const startTimer = () => {
    const orignalSeconds = convertTimeToSeconds(orignalSongDuration);
    if (orignalSeconds == duration) {
      setShowCountDown(true);
      socket.emit("bufferTimeReq", {
        time: 10,
      });
      setTimeout(() => {
        socket.emit("startIntroSecondsRequest", {
          time: 10,
        });

        dispatch(setPlayingState(true));
      }, 10000);
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
