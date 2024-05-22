"use client";

import React, { memo } from "react";
import {
  LivestreamLayout,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./style.css";

const StreamRequests = memo(({ item, fullScreen, isAccepted }) => {
  const { callId, token, userId } = item;
  const apiKey = "d7r2k5cjtzqj";
  const user = {
    id: userId,
    name: "Stream-Viewer",
    image: "https://getstream.io/random_svg/?id=oliver&name=Stream-Viewer",
  };
  const client = new StreamVideoClient({ apiKey, user, token });
  const call = client.call("livestream", callId);
  call.join();
  call.camera.disable();
  call.microphone.disable();

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
                height: isAccepted ? "24rem" : "14rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <LivestreamLayout
                  showParticipantCount={false}
                  showDuration={false}
                  showLiveBadge={false}
                  muted={false}
                />
              </div>
            </div>
          )}
        </StreamCall>
      </StreamVideo>
    </div>
  );
});

export default StreamRequests;
