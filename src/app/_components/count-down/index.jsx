"use client";
import React, { useEffect, useRef } from "react";

const CountDown = ({ openModal, timer }) => {
  const reff = useRef();

  useEffect(() => {
    if (openModal) {
      reff.current?.showModal();
    } else {
      reff.current?.close();
    }
  }, [openModal]);

  return (
    <div>
      <dialog ref={reff} className="modal">
        <div className="">
          <div className="flex  items-center justify-center  rounded-full font-mono text-6xl bg-white h-60  w-60 ">
            <div className="animate-ping">{timer}</div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CountDown;
