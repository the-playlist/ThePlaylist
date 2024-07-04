"use client";

import React, { memo, useEffect, useMemo } from "react";
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

  // Create user object only once
  const user = useMemo(
    () => ({
      id: userId,
      name: "Stream-Viewer",
      image: "https://getstream.io/random_svg/?id=oliver&name=Stream-Viewer",
    }),
    [userId]
  );

  // Initialize StreamVideoClient and call only once
  const { client, call } = useMemo(() => {
    const client = new StreamVideoClient({ apiKey, user, token });
    const call = client.call("livestream", callId);
    return { client, call };
  }, [apiKey, user, token, callId]);

  useEffect(() => {
    // Join call and disable camera/microphone only once
    call.join();
    call.camera.disable();
    call.microphone.disable();
  }, [call]);

  return (
    <div>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          {fullScreen ? (
            <div className="fullScreenContainer">
              <div className="innerContainer">
                <StreamTheme>
                  <LivestreamLayout
                    enableFullscreen={true}
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
              className={isAccepted ? "acceptedContainer" : "defaultContainer"}
            >
              <div className="innerContainer">
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
