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
} from "@stream-io/video-react-sdk";
import {
  useCall,
  useCallStateHooks,
  ParticipantView,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useSendStreamRequestMutation } from "../../_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const StreamRequest = ({ streamPayload, setStreamPayload }) => {
  const { token, user_id, callId } = streamPayload;

  const apiKey = "d7r2k5cjtzqj";
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiVW1lciBBbGkifQ.qa-bTjC4TNsA-mQ2_S87j6cK2XeoXkYIX1oP3svVYGg"; // the token can be found in the "Credentials" section
  // const userId = "Umer Ali"; // the user id can be found in the "Credentials" section
  // const callId = "asdasd";

  // set up the user object
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
  const [streamUrl, setStreamUrl] = useState(null);
  const [sendStreamReqApi] = useSendStreamRequestMutation();

  useEffect(() => {
    setStreamUrl(egress?.hls?.playlist_url);
  }, [egress?.hls?.playlist_url]);

  useEffect(() => {
    if (streamUrl) {
      streamRequestHandler();
    }
  }, [streamUrl]);

  const streamRequestHandler = async () => {
    let payload = {
      url: streamUrl,
      tableNo: streamPayload?.tableNo,
      userId: streamPayload?.user_id,
    };
    const response = await sendStreamReqApi(payload);
    if (response?.data.success) {
      toast(response?.data?.description);
    }
  };
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
      <div
        className="text-white"
        style={{ alignSelf: "center", marginBottom: "20px" }}
      >
        {isCallLive ? (
          <button
            onClick={() => {
              call?.stopLive();
              setStreamPayload(null);
              setStreamUrl(null);
              router.replace("/table-view");
            }}
          >
            Stop Livestream
          </button>
        ) : (
          <button
            onClick={() => {
              call?.goLive({ start_hls: true });
            }}
          >
            Start Livestream
          </button>
        )}
      </div>
    </div>
  );
};

export default StreamRequest;
