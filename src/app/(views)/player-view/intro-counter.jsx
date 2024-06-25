"use client";
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const IntroCounter = ({
  introSec,
  introTimer,
  index,
  performerList,
}) => {
  const [introCountdown, setIntroCountdown] = useState(introSec);
  const [isTimerOn, setIsTimerOn] = useState(false);

  useEffect(() => {
    setIntroCountdown(introSec);
  }, [performerList]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();

    // socket.on("bufferTimeReq", (item) => {
    //   if (index === 0) {
    //     setIsTimerOn(false);
    //     setIntroCountdown(introSec);
    //   }
    // });

    socket.on("startIntroSecondsResponse", (item) => {
      if (index === 0) {
        resetAndStartTimer();
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const resetAndStartTimer = () => {
    setIntroCountdown(introSec); // Reset countdown
    setIsTimerOn(true);
  };
  useEffect(() => {
    let timer;
    if (isTimerOn && introCountdown > 0) {
      timer = setTimeout(() => {
        setIntroCountdown(introCountdown - 1);
      }, 1000);
    } else {
      setIsTimerOn(false);
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [introCountdown, isTimerOn]);

  return (
    <div className=" h-10 w-10 text-sm bg-white rounded-full justify-center items-center flex float-end ">
      {introTimer}
    </div>
  );
};
