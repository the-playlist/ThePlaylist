"use client";
import React, { useEffect, useState } from "react";
import { useLazyGetLiveStreamQuery } from "../_utils/redux/slice/emptySplitApi";
import StreamRequests from "../_components/stream-requests";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { WALL_VIEW } from "../_utils/common/constants";

const JumboTron = () => {
  const [getLiveStreamApi] = useLazyGetLiveStreamQuery();
  const [content, setContent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();
    socket.on("sendReqToMasterRes", (item) => {
      if (item?.stopByUser) {
        getLiveStreamHandler();
      }
    });

    socket.on("acceptedRejectStreamRes", (item) => {
      if (content == null || item?.id != content?.callId) {
        getLiveStreamHandler();
      }
    });
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    getLiveStreamHandler();
  }, []);

  const getLiveStreamHandler = async () => {
    let response = await getLiveStreamApi();

    if (response?.data?.success) {
      const { content } = response?.data;
      setContent(content[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#272a30]   ">
      <div className="bg-[#272a30]">
        {content != null ? (
          <StreamRequests item={content} fullScreen={true} />
        ) : (
          <div className="flex items-center justify-center p-5">
            <span className=" bg-white mr-2 loading loading-spinner loading-md"></span>
            <div className="text-white text-2xl">
              Waiting for the livestream to start
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JumboTron;
