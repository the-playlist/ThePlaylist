import React from "react";
import { IoIosMusicalNotes } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import GenericButton from "../generic-button";

const ShowQualifiedList = ({ title, currentInfo, isUser }) => {
  return (
    <dialog id="my_modal_5" className="modal">
      <div className="modal-box  w-11/12 max-w-2xl">
        <form
          method="dialog"
          className="flex  items-start justify-between flex-1 "
        >
          <div className=" font-bold text-lg mb-3 ">{title}</div>
        </form>
        <div className=" flex flex-col justify-evenly max-h-60 overflow-y-auto border p-1 rounded-md">
          {currentInfo?.map((i, index) => (
            <div
              className={`cursor-pointer ${
                index < currentInfo?.length - 1 && "border-b"
              } py-1 border-gray-200 flex items-center justify-between px-2 `}
            >
              <div className="flex flex-row items-center my-2">
                <div className=" flex items-center justify-center p-2 bg-[#fdf9ec] rounded-full mr-3 ">
                  {isUser ? (
                    <FaUserAlt className="text-primary" />
                  ) : (
                    <IoIosMusicalNotes className="text-primary" />
                  )}
                </div>
                <div className={`font-semibold text-black `}>
                  {i?.fullname || i?.title}
                </div>
              </div>
              <span className={`text-black font-light `}>{i?.artist}</span>
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
