"use client";
import React, { useEffect, useRef } from "react";
import CustomLoader from "../custom_loader";

const ScreenLoader = ({ openModal }) => {
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
        {/* <div className="">
          <div className="flex flex-col  items-center justify-center  rounded-full font-mono text-6xl bg-white h-60  w-60 relative ">
            <CustomLoader bgColor={"bg-[#1F1F1F]"} />
            <p className="text-base text-primary absolute top-[60%] ">
              Please Wait.
            </p>
          </div>
        </div> */}
        <div>
          <div className="flex">
            <span className="loading loading-ball loading-xs bg-white"></span>
            <span className="loading loading-ball loading-sm bg-white"></span>
            <span className="loading loading-ball loading-md bg-white"></span>
            <span className="loading loading-ball loading-lg bg-white"></span>
          </div>
          <p className="text-base text-primary mt-2">Please Wait...</p>
        </div>
      </dialog>
    </div>
  );
};

export default ScreenLoader;
