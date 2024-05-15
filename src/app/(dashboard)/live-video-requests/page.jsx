"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  useChangeStreamRequestStatusMutation,
  useLazyGetStreamRequestQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { Listener_URL } from "../../_utils/common/constants";
import { CustomLoader, StreamRequest } from "@/app/_components";

const StreamResponse = () => {
  const [socket, setSocket] = useState();
  const [getStreamRequestListApi, getStreamRequestResponse] =
    useLazyGetStreamRequestQuery();
  const [changeStatusApi, changeStatusResponse] =
    useChangeStreamRequestStatusMutation();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io(Listener_URL, { autoConnect: false });
    socket.connect();
    setSocket(socket);
    socket.on("sendReqToMasterRes", (item) => {
      console.log("item", item);
      getStreamRequestHandler();
    });

    socket.on("acceptedRejectStreamRes", (item) => {
      getStreamRequestHandler();
    });
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    getStreamRequestHandler();
  }, []);

  const getStreamRequestHandler = async () => {
    let response = await getStreamRequestListApi();

    if (response?.data?.success) {
      setContent(response?.data?.content);
    }
    setLoading(false);
  };

  const changeStatusHandler = async (data) => {
    let response = await changeStatusApi(data);
    if (response?.data.success) {
      getStreamRequestHandler();
      socket.emit("acceptedRejectStreamReq", data?.isActive ? true : false);
    }
  };

  return (
    <div className="min-h-screen py-10 ">
      {loading ? (
        <CustomLoader />
      ) : content?.length > 0 ? (
        <div className="flex flex-wrap items-center justify-start ">
          {content?.map((item) => {
            return (
              <div className="card  w-[32%] bg-base-100 shadow-xl mr-4  mb-4 p-5">
                <div className="flex justify-between items-center mb-3 ">
                  <h2 className="card-title">Table no:{item?.tableNo} </h2>

                  <div className="border-2 rounded-full border-black ">
                    <span className="card-title text-sm p-1">20 </span>
                  </div>
                </div>
                <div className="bg-black h-56 rounded-md">
                  <figure>
                    <StreamRequest item={item} socket={socket} />
                  </figure>
                </div>
                <div className="mt-3">
                  {/* <p>userId: {item?.userId}</p> */}
                  <div className=" flex justify-between items-center">
                    <div className="card-actions justify-end w-full mr-2">
                      <button
                        onClick={() => {
                          let payload = {
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
          })}
        </div>
      ) : (
        <div className="text-black text-lg flex h-[90vh] items-center justify-center font-semibold">
          {"No stream requests yet"}
        </div>
      )}
    </div>
  );
};

export default StreamResponse;
