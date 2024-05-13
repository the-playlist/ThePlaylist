// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   MeetingProvider,
//   MeetingConsumer,
//   useMeeting,
//   useParticipant,
//   Constants,
// } from "@videosdk.live/react-sdk";
// import Hls from "hls.js";
// import { authToken } from "../stream-request/page";

// interface Request {
//   id: number;
//   isTrue: boolean;
// }
// const StreamResponse = () => {
//   const [requests, setRequests] = useState<any>([]);
//   const [meetingId, setMeetingId] = useState<string | null>(null);

//   useEffect(() => {
//     getRequest();
//   }, []);

//   const getRequest = async () => {
//     let res = await fetch("http://localhost:3000/api/stream/getStreamRequest", {
//       method: "GET",
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       return alert("something went wrong");
//     }

//     const result = await res.json();
//     const { content } = result;
//     setRequests(content);
//   };
//   const deleteRequest = async (reqId: any) => {
//     let res = await fetch(
//       `http://localhost:3000/api/stream/deleteStreamRequest?id=${reqId}`,
//       {
//         method: "DELETE",
//         cache: "no-store",
//       }
//     );

//     if (!res.ok) {
//       return alert("something went wrong");
//     }
//     getRequest();
//   };
//   function ViewerView() {
//     // States to store downstream url and current HLS state
//     const playerRef = useRef<HTMLVideoElement>(null);
//     //Getting the hlsUrls

//     const { hlsUrls, hlsState } = useMeeting();

//     //Playing the HLS stream when the downstreamUrl is present and it is playable
//     useEffect(() => {
//       if (hlsUrls.downstreamUrl && hlsState == "HLS_PLAYABLE") {
//         if (Hls.isSupported()) {
//           const hls = new Hls({
//             maxLoadingDelay: 1, // max video loading delay used in automatic start level selection
//             defaultAudioCodec: "mp4a.40.2", // default audio codec
//             maxBufferLength: 0, // If buffer length is/becomes less than this value, a new fragment will be loaded
//             maxMaxBufferLength: 1, // Hls.js will never exceed this value
//             startLevel: 0, // Start playback at the lowest quality level
//             startPosition: -1, // set -1 playback will start from intialtime = 0
//             maxBufferHole: 0.001, // 'Maximum' inter-fragment buffer hole tolerance that hls.js can cope with when searching for the next fragment to load.
//             highBufferWatchdogPeriod: 0, // if media element is expected to play and if currentTime has not moved for more than highBufferWatchdogPeriod and if there are more than maxBufferHole seconds buffered upfront, hls.js will jump buffer gaps, or try to nudge playhead to recover playback.
//             nudgeOffset: 0.05, // In case playback continues to stall after first playhead nudging, currentTime will be nudged evenmore following nudgeOffset to try to restore playback. media.currentTime += (nb nudge retry -1)*nudgeOffset
//             nudgeMaxRetry: 1, // Max nb of nudge retries before hls.js raises a fatal BUFFER_STALLED_ERROR
//             maxFragLookUpTolerance: 0.1, // This tolerance factor is used during fragment lookup.
//             liveSyncDurationCount: 1, // if set to 3, playback will start from fragment N-3, N being the last fragment of the live playlist
//             abrEwmaFastLive: 1, // Fast bitrate Exponential moving average half-life, used to compute average bitrate for Live streams.
//             abrEwmaSlowLive: 3, // Slow bitrate Exponential moving average half-life, used to compute average bitrate for Live streams.
//             abrEwmaFastVoD: 1, // Fast bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams
//             abrEwmaSlowVoD: 3, // Slow bitrate Exponential moving average half-life, used to compute average bitrate for VoD streams
//             maxStarvationDelay: 1, // ABR algorithm will always try to choose a quality level that should avoid rebuffering
//           });

//           const player = document.querySelector<HTMLMediaElement>("#hlsPlayer");

//           hls.loadSource(hlsUrls.downstreamUrl);
//           if (player) {
//             if (Hls.isSupported()) {
//               const hls = new Hls();
//               hls.loadSource(hlsUrls.downstreamUrl);
//               hls.attachMedia(player);
//             } else {
//               player.src = hlsUrls.downstreamUrl;
//               player.play().catch((error) => {
//                 console.error("Error playing video:", error);
//               });
//             }
//           }
//         } else {
//           if (typeof playerRef.current?.play === "function") {
//             playerRef.current.src = hlsUrls.downstreamUrl;
//             playerRef.current.play();
//           }
//         }
//       }
//     }, [hlsUrls, hlsState, playerRef.current]);
//     const handleVideoPlaying = () => {
//       console.log("Video is playing!");
//     };

//     return (
//       <div className=" h-36  ">
//         {/* Showing message if HLS is not started or is stopped by HOST */}
//         {hlsState != "HLS_PLAYABLE" ? (
//           <div>
//             <p>HLS has not started yet or is stopped</p>
//           </div>
//         ) : (
//           hlsState == "HLS_PLAYABLE" && (
//             <div className=" mt-32">
//               <video
//                 ref={playerRef}
//                 id="hlsPlayer"
//                 autoPlay={true}
//                 controls
//                 style={{ width: "100%", height: "100%" }}
//                 playsInline
//                 muted={true}
//                 onPlaying={handleVideoPlaying}
//                 onError={(err) => {
//                   console.log(err, "hls video error");
//                 }}
//               ></video>
//             </div>
//           )
//         )}
//       </div>
//     );
//   }
//   function Container(props: any) {
//     const [joined, setJoined] = useState<string | null>(null);

//     const { join } = useMeeting();
//     const mMeeting = useMeeting({
//       onMeetingJoined: () => {
//         setJoined("JOINED");
//       },

//       onMeetingLeft: () => {
//         props.onMeetingLeave();
//       },

//       onError: (error) => {
//         alert(error.message);
//       },
//     });

//     const joinMeeting = () => {
//       setJoined("JOINING");
//       join();
//     };
//     useEffect(() => {
//       joinMeeting();
//     }, []);

//     const mMeetingRef = useRef(mMeeting);
//     useEffect(() => {
//       mMeetingRef.current = mMeeting;
//     }, [mMeeting]);

//     return (
//       <div className="container h-24 p-5">
//         <h3 className="text-white">Stream Id: {props.meetingId}</h3>
//         {joined && joined == "JOINED" ? (
//           mMeeting.localParticipant.mode == Constants.modes.VIEWER ? (
//             <ViewerView />
//           ) : null
//         ) : joined && joined == "JOINING" ? (
//           <p className="text-white">Joining...</p>
//         ) : null}
//       </div>
//     );
//   }
//   function updateStatus(id: String, newStatus: boolean) {
//     const updatedObjects = requests.map((obj: { id: any }) => {
//       if (obj.id === id) {
//         return { ...obj, isTrue: newStatus };
//       }
//       return obj;
//     });
//     setRequests(updatedObjects);
//   }
//   const onMeetingLeave = () => {
//     setMeetingId(null);
//   };
//   return (
//     <div className="flex min-h-screen flex-col ">
//       <div className="flex flex-wrap items-center p-4">
//         {requests?.map((item: any) => {
//           const meetingId = item?.streamId;
//           return (
//             <div className="card  w-full lg:w-[500px]  bg-slate-600  text-neutral-content m-3">
//               {/* {item.isTrue && meetingId ? ( */}
//               <MeetingProvider
//                 config={{
//                   debugMode: true,
//                   meetingId,
//                   micEnabled: true,
//                   webcamEnabled: true,
//                   name: "C.V. Raman",
//                   mode: "VIEWER",
//                 }}
//                 token={authToken}
//               >
//                 <MeetingConsumer>
//                   {() => (
//                     <Container
//                       meetingId={item.streamId}
//                       onMeetingLeave={onMeetingLeave}
//                     />
//                   )}
//                 </MeetingConsumer>
//               </MeetingProvider>
//               {/* ) : (

//             )} */}
//               <div className="card-body items-center text-center">
//                 <h2 className="card-title text-white">Request!</h2>
//                 <p className="text-white">User request for live stream.</p>
//                 <div className="card-actions">
//                   {item.isTrue == null ? (
//                     <>
//                       <button
//                         onClick={() => {
//                           setMeetingId(item.id);
//                           updateStatus(item.id, true);
//                         }}
//                         className="btn btn-primary"
//                       >
//                         Accept
//                       </button>
//                       <button
//                         onClick={() => {
//                           deleteRequest(item.id);
//                         }}
//                         className="btn btn-ghost text-white"
//                       >
//                         Deny
//                       </button>
//                     </>
//                   ) : item.isTrue == true ? (
//                     <h2 className="card-title text-green-500">Accepted</h2>
//                   ) : (
//                     <h2 className="card-title text-red-500">Rejected</h2>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default StreamResponse;

"use client";

import React, { useEffect, useState } from "react";
import {
  LivestreamLayout,
  StreamVideo,
  StreamCall,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import {
  useCall,
  useCallStateHooks,
  ParticipantView,
} from "@stream-io/video-react-sdk";

import {
  useLazyGetStreamRequestQuery,
  useChangeStreamRequestStatusMutation,
} from "../_utils/redux/slice/emptySplitApi";
import ReactHlsPlayer from "react-hls-player";
import { io } from "socket.io-client";
import { Listener_URL } from "../_utils/common/constants";
import { CustomLoader } from "../_components";

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
    socket.on("acceptedRejectStreamRes", (item) => {
      setLoading(true);
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
    setContent([]);
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
    }
  };

  return (
    <div className="min-h-screen p-12">
      {loading ? (
        <CustomLoader />
      ) : (
        <div className="flex flex-wrap items-center justify-center ">
          {content?.length > 0 ? (
            content?.map((item) => {
              return (
                <div className="card w-[30%] bg-base-100 shadow-xl mx-7 mb-14">
                  <figure>
                    <ReactHlsPlayer
                      src={item?.url}
                      autoPlay={true}
                      controls={true}
                      width="100%"
                      height="100%"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">Table no:{item?.tableNo} </h2>
                    <p>userId: {item?.userId}</p>
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
                            socket.emit("acceptedRejectStreamReq", true);
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
                            socket.emit("acceptedRejectStreamReq", false);
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
            })
          ) : (
            <div>{"No Records Found"}</div>
          )}
        </div>
      )}
    </div>
  );
};

export const MyLivestreamUI = ({ streamPayload, setStreamPayload }) => {
  const {
    useIsCallLive,
    useLocalParticipant,
    useParticipantCount,
    useCallEgress,
  } = useCallStateHooks();
  const totalParticipants = useParticipantCount();
  const localParticipant = useLocalParticipant();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <div
        style={{
          alignSelf: "flex-start",
          color: "white",
          backgroundColor: "blue",
          borderRadius: "8px",
          padding: "4px 6px",
        }}
      >
        Live: {totalParticipants}
      </div>
      <div style={{ flex: 1, width: "100%", height: "auto" }}>
        {localParticipant && (
          <ParticipantView
            participant={localParticipant}
            // disables the extra UI elements as such:
            // name, audio, video indicator, etc...
            ParticipantViewUI={null}
          />
        )}
      </div>
    </div>
  );
};
export default StreamResponse;
