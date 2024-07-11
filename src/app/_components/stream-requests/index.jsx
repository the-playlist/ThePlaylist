"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import {
  LivestreamLayout,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./style.css";

const StreamRequests = memo(
  ({ item, fullScreen, isAccepted, userLeftHandler }) => {
    const { callId, token, userId } = item;
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

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
      const handleCallEnded = (e, eventType) => {
        userLeftHandler();
      };
      // Add listener for call ended event
      call.on("call.session_participant_left", handleCallEnded);
      // Cleanup function to remove listener on unmount
      return () => call.off("call.session_participant_left", handleCallEnded);
    }, [call]);

    useEffect(() => {
      // Join call and disable camera/microphone only once
      call.join({ create: true });
      call.camera.disable();
      call.microphone.disable();
    }, [call]);

    return (
      <div>
        <StreamVideo client={client}>
          <StreamCall call={call}>
            {fullScreen ? (
              <StreamTheme>
                <div className="fullScreenContainer">
                  <div className="innerContainer">
                    <LivestreamLayout
                      showParticipantCount={false}
                      showDuration={false}
                      showLiveBadge={true}
                      muted={false}
                    />
                  </div>
                </div>
              </StreamTheme>
            ) : (
              <div
                className={
                  isAccepted ? "acceptedContainer" : "defaultContainer"
                }
              >
                <div className="innerContainer">
                  <LivestreamLayout
                    enableFullscreen={true}
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
  }
);

export default StreamRequests;
