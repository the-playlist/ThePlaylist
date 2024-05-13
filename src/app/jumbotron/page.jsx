"use client";
import React, { useEffect, useState } from "react";
import ReactHlsPlayer from "react-hls-player";
import { useLazyGetLiveStreamQuery } from "../_utils/redux/slice/emptySplitApi";

const JumboTron = () => {
  const [getLiveStreamApi] = useLazyGetLiveStreamQuery();
  const [content, setContent] = useState(null);

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
    <div className="min-h-screen">
      {content != null ? (
        <ReactHlsPlayer
          src={content?.url}
          autoPlay={true}
          controls={true}
          width="100%"
          height="100%"
        />
      ) : (
        <div className="text-black">waiting for live stream....</div>
      )}
    </div>
  );
};

export default JumboTron;
