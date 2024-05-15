"use client";
import { useEffect, useState } from "react";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
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

const LiveVideo = ({ streamPayload, setStreamPayload }) => {
  const { token, user_id, callId } = streamPayload;
  const apiKey = "d7r2k5cjtzqj";
  const user = {
    id: user_id,
    name: "Playlist",
    image: "https://getstream.io/random_svg/?id=oliver&name=Playlist",
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
  const [timer, setTimer] = useState(60);
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
      toast(
        item
          ? "Now You are live"
          : "Your stream has been declined by the master "
      );
      if (item == false) {
        call?.stopLive();
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
      socket.emit("sendReqToMasterApi", false);
      call?.stopLive();
      call?.endCall();
      setStreamPayload(null);
      setStreamUrl(null);
      router.replace("/table-view");
    }
  };

  const streamRequestHandler = async () => {
    let payload = {
      url: streamUrl,
      tableNo: streamPayload?.tableNo || 0,
      userId: streamPayload?.user_id,
      callId: streamPayload?.callId,
      token: streamPayload?.token,
    };
    const response = await sendStreamReqApi(payload);
    if (response?.data.success) {
      socket.emit("sendReqToMasterApi", true);
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
            let payload = {
              id: content?._id,
              isActive: false,
            };
            changeStatusHandler(payload);
            return 60;
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
    setTimer(60);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {isActive && (
        <div className="text-white text-md">
          {`Your request has been sent to master: `}
          <span className="countdown font-mono text-lg  text-white">
            <span style={{ "--value": timer }}> </span>
            {` sec`}
          </span>
        </div>
      )}
      <div className="flex w-full  min-h-[80vh]">
        {localParticipant && (
          <ParticipantView
            participant={localParticipant}
            ParticipantViewUI={null}
          />
        )}
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
    </div>
  );
};

export default LiveVideo;
