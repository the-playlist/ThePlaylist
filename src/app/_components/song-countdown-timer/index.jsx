"use client";
import { useState, useEffect } from "react";
import { IoPlaySharp, IoPause } from "react-icons/io5";

const SongCountdownTimer = ({ duration }) => {
  const [isRunning, setIsRunning] = useState(false);
  let timer;

  useEffect(() => {
    if (isRunning) {
      timer = setInterval(() => {
        setTimeInSeconds((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            setIsRunning(false);
            return convertTimeToSeconds(duration);
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, duration]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeInSeconds(convertTimeToSeconds(duration));
    setIsRunning(false);
  };

  const convertTimeToSeconds = (timeString) => {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
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
    <div>
      <div className="    flex items-center justify-end ">
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
    </div>
  );
};
export default SongCountdownTimer;
