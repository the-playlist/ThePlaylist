import React from "react";
import { IoIosMusicalNotes } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import GenericButton from "../generic-button";
import { useSelector } from "react-redux";

const ShowQualifiedList = ({ title, currentInfo, isUser }) => {
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );
  return (
    <dialog id="my_modal_5" className="modal">
      <div
        className={`modal-box  w-11/12 max-w-2xl ${masterViewTheme ? "bg-white text-black" : "bg-dark text-white"}`}
      >
        <form
          method="dialog"
          className="flex  items-start justify-between flex-1 "
        >
          <div className=" font-bold text-lg mb-3 ">{title}</div>
        </form>
        <div
          className={` flex flex-col justify-evenly max-h-60 overflow-y-auto border ${masterViewTheme ? "bg-white" : "bg-light-tile"} p-1 rounded-md`}
        >
          {currentInfo?.map((i, index) => (
            <div
              className={`cursor-pointer ${
                index < currentInfo?.length - 1 && "border-b"
              } py-1 border-gray-200 flex items-center justify-between px-2 `}
            >
              <div className="flex flex-row items-center my-2">
                <div
                  className={` flex items-center justify-center p-2 ${masterViewTheme ? "bg-[#fdf9ec]" : "bg-[#EFC4401A]"} rounded-full mr-3 `}
                >
                  {isUser ? (
                    <FaUserAlt className="text-primary" />
                  ) : (
                    <IoIosMusicalNotes className="text-primary" />
                  )}
                </div>
                <div className={`font-semibold  `}>
                  {i?.fullname || i?.title}
                </div>
              </div>
              <span className={` font-light `}>{i?.artist}</span>
            </div>
          ))}
        </div>
        <form
          method="dialog"
          className="flex  items-center justify-between flex-1 mt-3 "
        >
          <GenericButton text="Ok" />
        </form>
      </div>
    </dialog>
  );
};

export default ShowQualifiedList;
