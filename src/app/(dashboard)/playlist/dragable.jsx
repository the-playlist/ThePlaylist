import React from "react";
import { SortByMasterIcon, RevertMasterIcon } from "@/app/svgs";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";

export const Dragable = ({
  children,
  onClick,
  onTouchStart,
  onMouseDown,
  ...props
}) => {
  return (
    <div className="w-1/12 flex font-extrabold text-lg  ">
      <div
        onClick={onClick}
        onTouchStart={(e) => {
          e.preventDefault();
          onTouchStart(e);
        }}
        onMouseDown={(e) => {
          onMouseDown(e);
        }}
        className=" flex items-center justify-center  cursor-pointer disable-select dragHandle"
        {...props}
      >
        {children}
      </div>
    </div>
  );
};
export const DragHandle = (
  isLockedSongs,
  sortByMaster,
  revertCrownhandler,
  onTouchStart,
  onMouseDown,
  count,
  item
) => {
  if (!isLockedSongs) {
    if (sortByMaster) {
      return (
        <Dragable
          onTouchStart={onTouchStart}
          onMouseDown={onMouseDown}
          onClick={() => {
            revertCrownhandler(item);
          }}
        >
          <RevertMasterIcon />
        </Dragable>
      );
    } else {
      return (
        <Dragable
          onTouchStart={onTouchStart}
          onMouseDown={onMouseDown}
          onClick={() => {}}
          className="border flex items-center justify-center text-top-queue-bg border-gray-300 rounded-full h-10 w-10 cursor-all-scroll disable-select dragHandle "
        >
          <HiOutlineArrowsUpDown />
        </Dragable>
      );
    }
  } else {
    return (
      <div className="w-1/12 text-start font-extrabold text-lg ">{count}</div>
    );
  }
};
