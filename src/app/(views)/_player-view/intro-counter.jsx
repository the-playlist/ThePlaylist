"use client";
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const IntroCounter = ({
  introTimer,
  index,
  performerList,
  showCountDown,
}) => {
  const [introCountdown, setIntroCountdown] = useState(introTimer);
  const [isTimerOn, setIsTimerOn] = useState(false);

  useEffect(() => {
    setIsTimerOn(false);
    setIntroCountdown(introTimer);
  }, [performerList]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();

    // socket.on("startPlayerViewTimeRes", (item) => {
    //   if (index === 0 && introTimer == introCountdown) {
    //     debugger;
    //     resetAndStartTimer();
    //   }
    // });
  }, []);

  const resetAndStartTimer = () => {
    setIsTimerOn(true);
  };

  // useEffect(() => {
  //   let timer;
  //   if (!showCountDown) {
  //     if (isTimerOn && introCountdown > 0) {
  //       timer = setTimeout(() => {
  //         setIntroCountdown(introCountdown - 1);
  //       }, 1000);
  //     } else {
  //       setIsTimerOn(false);
  //       clearTimeout(timer);
  //     }
  //   }
  //   return () => clearTimeout(timer);
  // }, [introCountdown, isTimerOn, showCountDown]);

  return (
    <div className=" h-12 w-12 text-base md:text-2xl bg-white rounded-full justify-center items-center flex float-end">
      {introCountdown}
    </div>
  );
};
