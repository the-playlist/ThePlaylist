// "use client";
// import React from "react";
// import { useState, useMemo, useRef, useEffect } from "react";
// import {
//   MeetingProvider,
//   MeetingConsumer,
//   useMeeting,
//   useParticipant,
//   Constants,
// } from "@videosdk.live/react-sdk";
// import ReactPlayer from "react-player";
// import { authToken } from "@/app/_utils/common/constants";
// import GenericButton from "../generic-button";

// function Controls() {
//   useEffect(() => {
//     startHls({
//       layout: {
//         type: "SPOTLIGHT",
//         priority: "PIN",
//         gridSize: 20,
//       },
//       theme: "LIGHT",
//       mode: "video-and-audio",
//       quality: "high",
//       orientation: "landscape",
//     });
//   }, []);

//   const { leave, toggleMic, toggleWebcam, startHls, stopHls } = useMeeting();
//   return (
//     <div>
//       <button onClick={() => leave()}>Leave</button>
//       &emsp;|&emsp;
//       <button onClick={() => toggleMic()}>toggleMic</button>
//       <button onClick={() => toggleWebcam()}>toggleWebcam</button>
//       &emsp;|&emsp;
//       <button
//         onClick={() => {
//           startHls({
//             layout: {
//               type: "SPOTLIGHT",
//               priority: "PIN",
//               gridSize: 20,
//             },
//             theme: "LIGHT",
//             mode: "video-and-audio",
//             quality: "high",
//             orientation: "landscape",
//           });
//         }}
//       >
//         Start HLS
//       </button>
//       <button onClick={() => stopHls()}>Stop HLS</button>
//     </div>
//   );
// }
// function ParticipantView(props) {
//   const micRef = useRef(null);
//   const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
//     useParticipant(props.participantId);

//   const videoStream = useMemo(() => {
//     if (webcamOn && webcamStream) {
//       const mediaStream = new MediaStream();
//       mediaStream.addTrack(webcamStream.track);
//       return mediaStream;
//     }
//   }, [webcamStream, webcamOn]);

//   useEffect(() => {
//     if (micRef.current) {
//       if (micOn && micStream) {
//         const mediaStream = new MediaStream();
//         mediaStream.addTrack(micStream.track);

//         micRef.current.srcObject = mediaStream;
//         micRef.current
//           .play()
//           .catch((error) =>
//             console.error("videoElem.current.play() failed", error)
//           );
//       } else {
//         micRef.current.srcObject = null;
//       }
//     }
//   }, [micStream, micOn]);

//   return (
//     <div className="min-h-screen bg-red-400">
//       <p>
//         Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
//         {micOn ? "ON" : "OFF"}
//       </p>
//       <audio ref={micRef} autoPlay playsInline muted={isLocal} />
//       {webcamOn && (
//         <div className=" ">
//           <ReactPlayer
//             playsinline
//             pip={false}
//             light={false}
//             controls={false}
//             muted={true}
//             playing={true}
//             width="100%"
//             height="100%"
//             url={videoStream}
//             onError={(err) => {
//               console.log(err, "participant video error");
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// function SpeakerView() {
//   const { participants, hlsState } = useMeeting();

//   const speakers = useMemo(() => {
//     const speakerParticipants = [...participants?.values()].filter(
//       (participant) => {
//         return participant.mode == Constants.modes.CONFERENCE;
//       }
//     );
//     return speakerParticipants;
//   }, [participants]);
//   return (
//     <div className="min-h-screen">
//       <p>Current HLS State: {hlsState}</p>

//       <Controls />

//       {speakers.map((participant) => (
//         <ParticipantView participantId={participant.id} key={participant.id} />
//       ))}
//     </div>
//   );
// }
// function Container(props) {
//   const [joined, setJoined] = useState(null);

//   const { join } = useMeeting();
//   const mMeeting = useMeeting({
//     onMeetingJoined: () => {
//       setJoined("JOINED");
//     },

//     onMeetingLeft: () => {
//       props.onMeetingLeave();
//     },
//     onError: (error) => {
//       alert(error.message);
//       console.log("error", error);
//     },
//   });

//   const joinMeeting = () => {
//     setJoined("JOINING");
//     join();
//   };
//   const mMeetingRef = useRef(mMeeting);
//   useEffect(() => {
//     mMeetingRef.current = mMeeting;
//   }, [mMeeting]);

//   const message = "Are you sure you want to proceed?";

//   return (
//     <div className=" min-h-screen text-white">
//       {joined && joined == "JOINED" ? (
//         <>
//           <h3>Stream Id: {props.meetingId}</h3>
//           <SpeakerView />
//         </>
//       ) : joined && joined == "JOINING" ? (
//         <p>Joining the Stream...</p>
//       ) : (
//         <dialog
//           ref={props.reff}
//           onClose={() => {
//             props.setShowModal(false);
//           }}
//           className="modal"
//         >
//           <div className="modal-box text-black  w-11/12 max-w-2xl">
//             <form
//               method="dialog"
//               className="flex  items-center justify-between flex-1 "
//             >
//               <div className=" font-bold text-lg text-black ">{message}</div>

//               <button
//                 onClick={() => {
//                   props.onMeetingLeave(false);
//                   props.setShowModal(false);
//                 }}
//                 className="btn btn-sm btn-circle btn-ghost  absolute top-1 right-1"
//               >
//                 ✕
//               </button>
//             </form>
//             <div className="flex justify-between items-center">
//               <div className="w-1/2">
//                 <GenericButton
//                   text="No"
//                   onClick={() => {
//                     props.onMeetingLeave(false);
//                     props.setShowModal(false);
//                   }}
//                 />
//               </div>
//               <div className="w-1/2">
//                 <GenericButton
//                   text="yes"
//                   onClick={() => {
//                     joinMeeting();
//                     props.setShowModal(false);
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </dialog>
//       )}
//     </div>
//   );
// }
// const StreamRequest = ({
//   setMeetingId,
//   meetingId,
//   setShowModal,
//   showModal,
// }) => {
//   const [mode, setMode] = useState("CONFERENCE");
//   const onMeetingLeave = () => {
//     setMeetingId(null);
//   };
//   const reff = useRef();

//   useEffect(() => {
//     if (showModal) {
//       reff.current?.showModal();
//     } else {
//       reff.current?.close();
//     }
//   }, [showModal]);
//   return (
//     authToken &&
//     meetingId && (
//       <MeetingProvider
//         config={{
//           debugMode: true,
//           meetingId,
//           micEnabled: true,
//           webcamEnabled: true,
//           name: "Sher Ali",

//           mode: mode,
//         }}
//         token={authToken}
//       >
//         <MeetingConsumer>
//           {() => (
//             <Container
//               meetingId={meetingId}
//               onMeetingLeave={onMeetingLeave}
//               setShowModal={setShowModal}
//               reff={reff}
//               showModal={showModal}
//             />
//           )}
//         </MeetingConsumer>
//       </MeetingProvider>
//     )
//   );
// };

// export default StreamRequest;

"use client";
import { useEffect, useState } from "react";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
  LivestreamLayout,
} from "@stream-io/video-react-sdk";
import {
  useCall,
  useCallStateHooks,
  ParticipantView,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  useSendStreamRequestMutation,
  useChangeStreamRequestStatusMutation,
} from "../../_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { Listener_URL } from "@/app/_utils/common/constants";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const StreamRequest = ({ streamPayload, setStreamPayload }) => {
  const { token, user_id, callId } = streamPayload;
  const apiKey = "d7r2k5cjtzqj";
  const user = {
    id: user_id,
    name: "User",
    image: "https://getstream.io/random_svg/?id=oliver&name=User",
  };

  const client = new StreamVideoClient({ apiKey, user, token });

  const call = client.call("livestream", callId);

  call.join({ create: true });

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyLivestreamUI
          setStreamPayload={setStreamPayload}
          streamPayload={streamPayload}
        />
      </StreamCall>
    </StreamVideo>
  );
};

export const MyLivestreamUI = ({ streamPayload, setStreamPayload }) => {
  const router = useRouter();
  const call = useCall();
  const {
    useIsCallLive,
    useLocalParticipant,
    useParticipantCount,
    useCallEgress,
  } = useCallStateHooks();
  const totalParticipants = useParticipantCount();
  const localParticipant = useLocalParticipant();
  const isCallLive = useIsCallLive();
  const egress = useCallEgress();
  const [changeStatusApi] = useChangeStreamRequestStatusMutation();
  const [sendStreamReqApi] = useSendStreamRequestMutation();
  const [timer, setTimer] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [content, setContent] = useState({});
  const [streamUrl, setStreamUrl] = useState(null);
  const [socket, setSocket] = useState();

  useEffect(() => {
    setStreamUrl(egress?.hls?.playlist_url);
  }, [egress?.hls?.playlist_url]);

  useEffect(() => {
    if (streamUrl) {
      streamRequestHandler();
    }
  }, [streamUrl]);

  useEffect(() => {
    const socket = io(Listener_URL, { autoConnect: false });
    socket.connect();
    setSocket(socket);
    socket.on("acceptedRejectStreamRes", (item) => {
      if (item != null) {
        toast(
          item
            ? "Now You are live"
            : "Your stream has been declined by the master "
        );
        if (item == false) {
          call?.stopLive();
        }
      }

      setIsActive(false);
    });
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  const changeStatusHandler = async (data) => {
    let response = await changeStatusApi(data);
    if (response?.data.success) {
      socket.emit("acceptedRejectStreamReq", false);
    }
  };

  const streamRequestHandler = async () => {
    let payload = {
      url: streamUrl,
      tableNo: streamPayload?.tableNo || 0,
      userId: streamPayload?.user_id,
    };
    const response = await sendStreamReqApi(payload);
    if (response?.data.success) {
      socket.emit("acceptedRejectStreamReq");
      setContent(response?.data?.content);
      toast(response?.data?.description);
      handleClick();
    }
  };
  useEffect(() => {
    let intervalId;
    if (isActive) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(intervalId);
            call?.stopLive();
            // call?.endCall();
            setIsActive(false);
            // setStreamPayload(null);
            // setStreamUrl(null);
            // router.replace("/table-view");
            // let payload = {
            //   id: content?._id,
            //   isActive: false,
            // };
            // changeStatusHandler(payload);
            return 30;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isActive]);

  const handleClick = () => {
    setIsActive(true);
    setTimer(30);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <div className="flex w-full  min-h-[80vh]">
        {localParticipant && (
          <ParticipantView
            participant={localParticipant}
            ParticipantViewUI={null}
          />
        )}
        {/* <LivestreamLayout
          muted={false}
          enableFullscreen={true}
          showParticipantCount={true}
          showDuration={true}
          showLiveBadge={true}
          showSpeakerName={false}
          floatingParticipantProps={{
            muted: false,
            enableFullscreen: true,
            showParticipantCount: true,
            showDuration: true,
            showLiveBadge: true,
            showSpeakerName: false,
            position: "top-right",
          }}
        /> */}
      </div>
      <div className="text-white sticky bottom-0 flex ">
        <div className="w-1/2 p-2">
          <button
            className="btn btn-primary bg-primary border-0  w-full text-black"
            onClick={() => {
              call?.stopLive();
              call?.endCall();
              setStreamPayload(null);
              setStreamUrl(null);
              router.replace("/table-view");
            }}
          >
            Go Back
          </button>
        </div>

        {isCallLive ? (
          <div className="w-1/2 p-2">
            <button
              className="btn btn-primary bg-primary border-0 w-full text-sm text-black"
              onClick={() => {
                let payload = {
                  id: content?._id,
                  isActive: false,
                };
                changeStatusHandler(payload);
                call?.stopLive();
                call?.endCall();
                setStreamPayload(null);
                setStreamUrl(null);
                router.replace("/table-view");
              }}
            >
              Stop Livestream
            </button>
          </div>
        ) : (
          <div className="w-1/2 p-2">
            <button
              className="btn btn-primary bg-primary border-0 text-sm  w-full text-black"
              onClick={() => {
                call?.goLive({ start_hls: true });
              }}
            >
              Request to Start Livestream
            </button>
          </div>
        )}
      </div>
      {isActive && (
        <div className="text-white text-lg">
          {`Your request has been sent to master: `}
          <span className="countdown font-mono  text-white">
            <span style={{ "--value": timer }}></span>
          </span>
        </div>
      )}
    </div>
  );
};

export default StreamRequest;
