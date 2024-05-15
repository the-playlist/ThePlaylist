"use client";

import React, { useEffect } from "react";
import {
  LivestreamLayout,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./style.css";

const StreamRequests = ({ item, fullScreen }) => {
  const { callId, token } = item;
  const apiKey = "d7r2k5cjtzqj";
  const user = {
    id: item?.userId,
    name: "Stream-Viewer",
    image: "https://getstream.io/random_svg/?id=oliver&name=Stream-Viewer",
  };
  const client = new StreamVideoClient({ apiKey, user, token });
  const call = client.call("livestream", callId);

  call.camera.disable();
  call.microphone.disable();

  call.join();

  return (
    <div>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          {fullScreen ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "90%",
                width: "100%",
              }}
            >
              <div style={{ flex: 1, height: "90%", width: "100%" }}>
                <StreamTheme>
                  <LivestreamLayout
                    showParticipantCount={false}
                    showDuration={true}
                    showLiveBadge={true}
                    // showParticipantCount={false}
                    //   showSpeakerName={true}
                    muted={false}
                  />
                </StreamTheme>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",

                height: "14rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <LivestreamLayout
                  showParticipantCount={false}
                  showDuration={false}
                  showLiveBadge={false}
                  // showParticipantCount={false}
                  //   showSpeakerName={true}
                  muted={false}
                />
              </div>
            </div>
          )}
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

export default StreamRequests;
