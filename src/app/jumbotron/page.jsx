"use client";
import React, { useEffect, useState, useRef } from "react";
import { useLazyGetLiveStreamQuery } from "../_utils/redux/slice/emptySplitApi";
import StreamRequests from "../_components/stream-requests";
import { io } from "socket.io-client";
import { Listener_URL } from "../_utils/common/constants";
import { ToggleFullScreen } from "../_components";
import { RiFullscreenFill } from "react-icons/ri";
import { MdOutlineFullscreenExit } from "react-icons/md";

const JumboTron = () => {
  const [getLiveStreamApi] = useLazyGetLiveStreamQuery();
  const [content, setContent] = useState(null);
  const elementRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const socket = io(Listener_URL, { autoConnect: false });
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
    <div className="min-h-screen p-5 bg-white ">
      <div className=" float-right">
        <button
          onClick={() => {
            ToggleFullScreen(elementRef, isFullScreen, setIsFullScreen);
          }}
        >
          {!isFullScreen ? (
            <RiFullscreenFill size={30} color="black" />
          ) : (
            <MdOutlineFullscreenExit size={40} color="black" />
          )}
        </button>
      </div>
      <div ref={elementRef} className="bg-white">
        {content != null ? (
          <StreamRequests item={content} fullScreen={true} />
        ) : (
          <div className="text-black">waiting for live stream....</div>
        )}
      </div>
    </div>
  );
};

export default JumboTron;
