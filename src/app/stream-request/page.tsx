"use client";
import React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
  Constants,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { FaVideo } from "react-icons/fa";
import { GenericButton } from "../_components";

export const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlNTI2ZmJkMi0xZjQ4LTQyYzgtODg5ZS01MmU3MmI1MmFjMmUiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcxNTA4Mjc5MCwiZXhwIjoxNzE1Njg3NTkwfQ.u7Z7BSvLpti-JPqnuMwCJRjl8C1iMZsiJ5zTrD5yp6U";

export const createMeeting = async ({ token }: { token: string }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const { roomId }: { roomId: string } = await res.json();
  return roomId;
};

const CustomAlert = ({ message, onConfirm, onCancel }: any) => {
  return (
    <div className="custom-alert">
      <p>{message}</p>
      <div className="button-container">
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};
function Controls() {
  useEffect(() => {
    startHls({
      layout: {
        type: "SPOTLIGHT",
        priority: "PIN",
        gridSize: 20,
      },
      theme: "LIGHT",
      mode: "video-and-audio",
      quality: "high",
      orientation: "landscape",
    });
  }, []);

  const { leave, toggleMic, toggleWebcam, startHls, stopHls } = useMeeting();
  return (
    <div>
      <button onClick={() => leave()}>Leave</button>
      &emsp;|&emsp;
      <button onClick={() => toggleMic()}>toggleMic</button>
      <button onClick={() => toggleWebcam()}>toggleWebcam</button>
      &emsp;|&emsp;
      <button
        onClick={() => {
          startHls({
            layout: {
              type: "SPOTLIGHT",
              priority: "PIN",
              gridSize: 20,
            },
            theme: "LIGHT",
            mode: "video-and-audio",
            quality: "high",
            orientation: "landscape",
          });
        }}
      >
        Start HLS
      </button>
      <button onClick={() => stopHls()}>Stop HLS</button>
    </div>
  );
}
function ParticipantView(props: any) {
  const micRef = useRef<HTMLAudioElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  //Playing the audio in the <audio>
  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error: any) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div>
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          //
          playsinline // extremely crucial prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"300px"}
          width={"300px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function SpeakerView() {
  const { participants, hlsState } = useMeeting();

  const speakers = useMemo(() => {
    const speakerParticipants = [...participants?.values()].filter(
      (participant) => {
        return participant.mode == Constants.modes.CONFERENCE;
      }
    );
    return speakerParticipants;
  }, [participants]);
  return (
    <div>
      <p>Current HLS State: {hlsState}</p>
      {/* Controls for the meeting */}
      <Controls />

      {/* Rendring all the HOST participants */}
      {speakers.map((participant) => (
        <ParticipantView participantId={participant.id} key={participant.id} />
      ))}
    </div>
  );
}
function Container(props: any) {
  const [joined, setJoined] = useState<string | null>(null);

  const { join } = useMeeting();
  const mMeeting = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },

    onMeetingLeft: () => {
      props.onMeetingLeave();
    },

    onError: (error) => {
      alert(error.message);
    },
  });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };
  const mMeetingRef = useRef(mMeeting);
  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  const message = "Are you sure you want to proceed?";

  return (
    <div className="container">
      {joined && joined == "JOINED" ? (
        <>
          <h3>Stream Id: {props.meetingId}</h3>
          <SpeakerView />
        </>
      ) : joined && joined == "JOINING" ? (
        <p>Joining the Stream...</p>
      ) : (
        // <button onClick={joinMeeting}>Join</button>
        <dialog
          ref={props.reff}
          onClose={() => {
            props.setShowModal(false);
          }}
          className="modal"
        >
          <div className="modal-box  w-11/12 max-w-2xl">
            <form
              method="dialog"
              className="flex  items-center justify-between flex-1 "
            >
              <div className=" font-bold text-lg ">{"You want to proceed"}</div>
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={() => {
                  props.onMeetingLeave(false);
                  props.setShowModal(false);
                }}
                className="btn btn-sm btn-circle btn-ghost  absolute top-1 right-1"
              >
                ✕
              </button>
            </form>
            <div className="flex justify-between items-center">
              <div className="w-1/2">
                <GenericButton
                  text="No"
                  onClick={() => {
                    props.onMeetingLeave(false);
                    props.setShowModal(false);
                  }}
                />
              </div>
              <div className="w-1/2">
                <GenericButton
                  text="yes"
                  onClick={() => {
                    joinMeeting();
                    props.setShowModal(false);
                  }}
                />
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
const StreamRequest = () => {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [mode, setMode] = useState<"CONFERENCE" | "VIEWER" | undefined>(
    "CONFERENCE"
  );

  const getMeetingAndToken = async (id?: string) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    if (meetingId) {
      let response = await fetch(
        "http://localhost:3000/api/stream/sendStreamRequest",
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ streamId: meetingId, isTrue: null }),
        }
      );
      if (response.ok) {
        alert("Your Request has been sent to Master");
      } else {
        alert("Error");
      }
      setShowModal(true);
    }

    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };
  const reff = useRef();

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (showModal) {
      reff.current?.showModal();
    } else {
      reff.current?.close();
    }
  }, [showModal]);
  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        debugMode: true,
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "C.V. Raman",

        mode: mode,
      }}
      token={authToken}
    >
      <MeetingConsumer>
        {() => (
          <Container
            meetingId={meetingId}
            onMeetingLeave={onMeetingLeave}
            setShowModal={setShowModal}
            reff={reff}
            showModal={showModal}
          />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <>
      <div className="flex justify-center ">
        <button
          onClick={() => {
            getMeetingAndToken();
          }}
          className="ml-4 w-full text-base flex items-center bg-[#1F1F1F]  border border-white   font-bold py-3 px-4 rounded-md justify-center text-white lg:hover:bg-gray-400"
        >
          <FaVideo size={16} className="mr-2" /> Live Video
        </button>
      </div>
    </>
  );
};

export default StreamRequest;
