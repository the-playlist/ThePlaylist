"use client";
import { useState, useEffect } from "react";
import { IoPlaySharp, IoPause } from "react-icons/io5";

const SongCountdownTimer = ({
  duration,
  advanceTheQueue,
  playlistSongList,
  isStart,
  setIsStart,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  let timer;

  useEffect(() => {
    if (isStart) {
      timer = setInterval(() => {
        setTimeInSeconds((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            setIsStart(false);
            handleTimeZero();
            return convertTimeToSeconds("0:00");
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isStart, duration]);

  const handleTimeZero = async () => {
    await advanceTheQueue(playlistSongList[0]?._id);
  };

  const startTimer = () => {
    setIsStart(true);
    setIsStart(true);
  };

  const pauseTimer = () => {
    setIsStart(false);
  };

  const resetTimer = () => {
    setTimeInSeconds(convertTimeToSeconds(duration));
    setIsStart(false);
  };

  const convertTimeToSeconds = (timeString) => {
    if (timeString?.length < 3) {
      return timeString;
    } else {
      const [minutes, seconds] = timeString?.split(":").map(Number);
      return minutes * 60 + seconds;
    }
  };
  const [timeInSeconds, setTimeInSeconds] = useState(
    convertTimeToSeconds(duration)
  );

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex items-center justify-end mr-2 ">
      <div className="bg-[#F7F7F7] flex items-center  justify-center px-3 py-2 rounded-3xl">
        <button
          onClick={() => {
            isRunning ? pauseTimer() : startTimer();
          }}
          className="h-8 w-8 bg-white shadow-xl rounded-full flex items-center justify-center mr-2 "
        >
          {isRunning ? <IoPause /> : <IoPlaySharp />}
        </button>
        {formatTime(timeInSeconds)}
      </div>
    </div>
  );
};
export default SongCountdownTimer;
