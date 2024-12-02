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
import { useSaveUserActionMutation } from "@/app/_utils/redux/slice/emptySplitApi";
import { usePathname } from "next/navigation";

const SongCountdownTimer = ({
  advanceTheQueue,
  playlistSongList,
  isStart,
  setShowCountDown,
  orignalSongDuration,
  socket,
}) => {
  const pathName = usePathname();
  const [saveUserActionApi] = useSaveUserActionMutation();

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
  const currentSongDetail = useSelector(
    (state) => state?.playlistReducer?.currentSong
  );

  useEffect(() => {
    if (isStart) {
      if (duration == 0) {
        clearInterval(timer);
        handleTimeZero();
        return;
      }
      timer = setInterval(() => {
        const remainingTime = parseInt(duration) - 1;
        dispatch(setCurrentSongSecond(remainingTime));
        if (remainingTime < 3) {
          socket.emit("remainingTimeReq", {
            duration: duration,
            currentSongDetail: currentSongDetail,
            playingState: playingState,
          });
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isStart, duration, playlistSongList[0]?._id]);

  const handleTimeZero = async () => {
    if (playlistSongList?.length > 1) {
      const songDuration = convertTimeToSeconds(
        playlistSongList[1]?.songDuration
      );
      dispatch(setCurrentSongSecond(songDuration));
      let payload = {
        actionName: "Next Song",
        pathName: pathName,
        details: {
          status: "success",
          content: playlistSongList[1],
          playingState: true,
        },
      };
      await saveUserActionApi(payload);
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
      // setShowCountDown(true);
      // socket.emit("bufferTimeReq", {
      //   time: 10,
      // });
      if (initialSongPlaylist) {
        socket.emit("startIntroSecondsRequest", {
          time: 10,
        });
        // setTimeout(() => {
        changePlayingState();
        // }, 10000);
      } else {
        changePlayingState();
      }
    } else {
    }
  }, [orignalSongDuration]);

  const startTimer = async () => {
    let payload = {
      actionName: "Start Timer",
      pathName: pathName,
      details: {
        status: "success",
        content: playlistSongList[0],
        playingState: true,
        signalName: "startIntroSecondsRequest",
      },
    };
    await saveUserActionApi(payload);
    dispatch(setInitialSongPlaylist(false));
    const orignalSeconds = convertTimeToSeconds(orignalSongDuration);
    if (orignalSeconds == duration) {
      // setShowCountDown(true);
      // socket.emit("bufferTimeReq", {
      //   time: 10,
      // });
      if (initialSongPlaylist) {
        socket.emit("startIntroSecondsRequest", {
          time: 10,
        });
        // setTimeout(() => {
        changePlayingState();
        // socket.emit("startPlayerViewTimeReq", {
        //   time: 10,
        // });
        // }, 10000);
      } else {
        changePlayingState();
      }
      // setTimeout(() => {
      //   socket.emit("startIntroSecondsRequest", {
      //     time: 10,
      //   });

      //   dispatch(setPlayingState(true));
      // }, 10000);
    } else {
      dispatch(setPlayingState(true));
    }
  };

  const pauseTimer = async () => {
    dispatch(setPlayingState(false));
    let payload = {
      actionName: "Pause Timer",
      pathName: pathName,
      details: {
        status: "success",
        content: playlistSongList[0],
        playingState: false,
      },
    };
    await saveUserActionApi(payload);
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
