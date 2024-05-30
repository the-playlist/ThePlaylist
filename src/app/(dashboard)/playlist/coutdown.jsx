"use client";
import React, { useEffect, useRef, useState } from "react";

const CountDown = ({ openModal, timer, setShowCountDown }) => {
  const reff = useRef();
  const [seconds, setSeconds] = useState(timer);

  useEffect(() => {
    if (openModal) {
      reff.current?.showModal();
    } else {
      reff.current?.close();
      setShowCountDown(false);
    }
  }, [openModal]);

  useEffect(() => {
    let timer;
    if (openModal && seconds > 0) {
      timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else {
      clearTimeout(timer);
      reff.current?.close();
      setShowCountDown(false);
    }

    return () => clearTimeout(timer);
  }, [seconds, openModal]);

  return (
    <div>
      <dialog ref={reff} className="modal">
        <div className="">
          <div className="flex  items-center justify-center  rounded-full font-mono text-6xl bg-white h-60  w-60 ">
            <div className="animate-ping">{seconds}</div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CountDown;
