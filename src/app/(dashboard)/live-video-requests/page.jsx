"use client";
import React, { useEffect, useState, useRef, memo } from "react";
import { io } from "socket.io-client";
import {
  useChangeStreamRequestStatusMutation,
  useLazyGetStreamRequestQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { Listener_URL } from "../../_utils/common/constants";
import {
  CustomLoader,
  StreamRequest,
  CurrentLiveVideo,
} from "@/app/_components";
import { FaRegStopCircle } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { toast } from "react-toastify";

const StreamResponse = () => {
  const arrayRef = useRef([]);
  const [refresh, setRefresh] = useState(false);
  const [socket, setSocket] = useState();
  const [getStreamRequestListApi, getStreamRequestResponse] =
    useLazyGetStreamRequestQuery();
  const [changeStatusApi, changeStatusResponse] =
    useChangeStreamRequestStatusMutation();
  const [streamContent, setStreamContent] = useState([]);
  const [streamAcceptedContent, setStreamAcceptedContent] = useState([]);

  const [loading, setLoading] = useState(true);
  const [recentActive, setRecentActive] = useState(null);
  useEffect(() => {
    const socket = io(Listener_URL, { autoConnect: false });
    socket.connect();
    setSocket(socket);
    socket.on("sendReqToMasterRes", (item) => {
      const { stopByUser, streamPayload } = item;
      if (stopByUser) {
        toast("Stream has been stopped by user");
      }

      // arrayRef?.current.push(streamPayload);
      // setRefresh((prev) => !prev);
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
      const {
        content: { isAcceptedRequests, isActiveRequests },
      } = response?.data;
      setStreamContent(isActiveRequests);
      setStreamAcceptedContent(isAcceptedRequests[0]);
      if (isAcceptedRequests[0]?.isAccepted) {
        setRecentActive(isAcceptedRequests[0]);
      }
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
      ) : (
        <div className=" h-[90vh] overflow-y-scroll pb-10">
          {streamAcceptedContent && (
            <div className="flex w-full flex-col">
              <span className=" text-lg font-semibold mb-2">Live View</span>
              <CurrentLiveVideo
                item={streamAcceptedContent}
                socket={socket}
                onStopClick={() => {
                  let payload = {
                    callId: streamAcceptedContent?.callId,
                    id: streamAcceptedContent?._id,
                    isActive: false,
                  };
                  changeStatusHandler(payload);
                }}
              />
            </div>
          )}
          {streamContent?.length > 0 ? (
            <>
              <span className=" text-lg font-semibold mb-4">Requests</span>

              <div className="flex flex-wrap items-center justify-start ">
                {streamContent.map((item, index) => {
                  return (
                    <div className="card  w-[32%] bg-base-100 shadow-xl mr-4  mb-4 p-5">
                      <div className="flex justify-between items-center mb-3 ">
                        <h2 className="card-title">Table no:{item?.tableNo}</h2>
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
            </>
          ) : (
            <div className="text-black text-lg flex h-[90vh] items-center justify-center font-semibold">
              {"No stream requests yet"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamResponse;
