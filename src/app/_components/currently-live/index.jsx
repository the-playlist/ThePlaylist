import React, { memo } from "react";
import { FaRegStopCircle } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { StreamRequests } from "../stream-requests";
import { useSelector } from "react-redux";

const CurrentLiveVideo = memo(({ item, onStopClick, socket }) => {
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );
  return (
    <div className="flex w-full ">
      <div
        className={`card  w-full bg-base-100 shadow-xl mr-4  mb-4 ${masterViewTheme ? "bg-light text-black" : "bg-light-tile text-white"} `}
      >
        <div className=" ">
          <div className="flex items-center  ">
            <div className="bg-[#f0ece0] px-5 py-3 rounded-tl-md rounded-br-md  text-black">
              Table no:{item?.tableno}
            </div>
            <div className="bg-[#E70012] text-white px-3 py-1 hover:bg-[#E70012]  ml-2 text-base rounded-tl-md rounded-br-md flex items-center ">
              <GoDotFill />
              <span>Live</span>
            </div>
          </div>
        </div>
        <div className=" p-5">
          <div className="bg-black h-96 rounded-md">
            <figure>
              <StreamRequests item={item} socket={socket} isAccepted={true} />
            </figure>
          </div>
          <div className="mt-3 ">
            <div className="card-actions justify-end w-full mr-2">
              <button
                onClick={onStopClick}
                className="btn btn-primary bg-[#E70012] border-0  hover:bg-red-600 text-white  w-full"
              >
                <FaRegStopCircle size={25} />
                Stop Live
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CurrentLiveVideo;
