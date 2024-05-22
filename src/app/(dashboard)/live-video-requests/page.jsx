"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  useChangeStreamRequestStatusMutation,
  useLazyGetStreamRequestQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { Listener_URL } from "../../_utils/common/constants";
import { CustomLoader, StreamRequest } from "@/app/_components";
import { FaRegStopCircle } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const StreamResponse = () => {
  const [socket, setSocket] = useState();
  const [getStreamRequestListApi, getStreamRequestResponse] =
    useLazyGetStreamRequestQuery();
  const [changeStatusApi, changeStatusResponse] =
    useChangeStreamRequestStatusMutation();
  const [streamContent, setStreamContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentActive, setRecentActive] = useState(null);
  useEffect(() => {
    const socket = io(Listener_URL, { autoConnect: false });
    socket.connect();
    setSocket(socket);
    socket.on("sendReqToMasterRes", (item) => {
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
      const { content } = response?.data;
      if (content[0]?.isAccepted) {
        setRecentActive(content[0]);
      }
      setStreamContent(content);
    }
    setLoading(false);
  };

  const changeStatusHandler = async (data) => {
    let response = await changeStatusApi(data);
    if (response?.data.success) {
      getStreamRequestHandler();
      socket.emit("acceptedRejectStreamReq", {
        id: data?.callId,
        isActive: data?.isActive ? true : false,
        recentActive: recentActive,
      });
    }
  };

  return (
    <div className="min-h-screen py-10 ">
      {loading ? (
        <CustomLoader />
      ) : streamContent?.length > 0 ? (
        <div className=" h-[90vh] overflow-y-scroll mb-32">
          <div className="flex flex-wrap items-center justify-start ">
            {streamContent?.map((item) => {
              return item?.isAccepted ? (
                <div className="flex w-full flex-col">
                  <span className=" text-lg font-semibold mb-2">Live View</span>
                  <LiveVideo
                    item={item}
                    socket={socket}
                    onStopClick={() => {
                      let payload = {
                        callId: item?.callId,
                        id: item?._id,
                        isActive: false,
                      };
                      changeStatusHandler(payload);
                    }}
                  />
                </div>
              ) : (
                <div className="card  w-[32%] bg-base-100 shadow-xl mr-4  mb-4 p-5">
                  <div className="flex justify-between items-center mb-3 ">
                    <h2 className="card-title">Table no:{item?.tableNo} </h2>

                    {/* <div className="border-2 rounded-full border-black ">
                      <span className="card-title text-sm p-1">20 </span>
                    </div> */}
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
            })}
          </div>
        </div>
      ) : (
        <div className="text-black text-lg flex h-[90vh] items-center justify-center font-semibold">
          {"No stream requests yet"}
        </div>
      )}
    </div>
  );
};

const LiveVideo = ({ item, onStopClick, socket }) => {
  return (
    <div className="flex w-full ">
      <div className="card  w-full bg-base-100 shadow-xl mr-4  mb-4">
        <div className=" ">
          <div className="flex items-center  ">
            <div className="bg-[#f0ece0] px-5 py-3 rounded-tl-md rounded-br-md ">
              Table no:{0}
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
              <StreamRequest item={item} socket={socket} isAccepted={true} />
            </figure>
          </div>
          <div className="mt-3 ">
            <div className="card-actions justify-end w-full mr-2">
              <button
                onClick={onStopClick}
                className="btn btn-primary bg-[#E70012] border-0  text-white  w-full"
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
};

export default StreamResponse;
