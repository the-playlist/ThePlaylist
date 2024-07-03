import React, { memo } from "react";
import { StreamRequest } from "@/app/_components";

export const VideoStreamUI = memo(({ item, socket, changeStatusHandler }) => {
  return (
    <div className="card  w-[32%] bg-base-100 shadow-xl mr-4  mb-4 p-5">
      <div className="flex justify-between items-center mb-3 ">
        <h2 className="card-title">Table no:{item?.tableno}</h2>
      </div>
      <div className="bg-black h-56 rounded-md">
        <figure>
          <StreamRequest item={item} socket={socket} />
        </figure>
      </div>
      <div className="mt-3">
        <div className=" flex justify-between items-center">
          <div className="card-actions justify-end w-full mr-2">
            <button
              onClick={() => {
                let payload = {
                  callId: item?.callId,
                  id: item?._id,
                  isAccepted: true,
                  isActive: true,
                };

                changeStatusHandler(payload);
              }}
              className="btn btn-primary bg-primary border-0 hover:bg-primary  text-black w-full"
            >
              Accept
            </button>
          </div>
          <div className="card-actions justify-end w-full  ml-2">
            <button
              onClick={() => {
                let payload = {
                  callId: item?.callId,
                  id: item?._id,
                  isActive: false,
                };

                changeStatusHandler(payload);
              }}
              className="btn btn-primary bg-black border-0 text-white hover:bg-black w-full"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
