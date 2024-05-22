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

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    const initCall = async () => {
      const client = new StreamVideoClient({ apiKey, user, token });
      const call = client.call("livestream", callId);
      await call.join({ create: true });
      await call.goLive({ start_hls: true });
      setClient(client);
      setCall(call);
    };

    initCall();

    return () => {
      if (call) {
        call.stopLive();
        call.endCall();
      }
    };
  }, []);

  if (!client || !call) return null;

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
  const [currentLive, setCurrentLive] = useState(null);
  const [isRequestSent, setIsRequestSent] = useState(false);

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
      const { id, isActive, recentActive } = item;
      if (id == streamPayload?.callId) {
        setCurrentLive(id);
        toast(
          isActive
            ? "Now You are live"
            : "Your request has been declined by the master"
        );
        if (isActive == false) {
          call?.stopLive();
          call?.endCall();
          setStreamPayload(null);
          setStreamUrl(null);
          router.replace("/table-view");
        }
        setIsActive(false);
      }
      if (recentActive?.callId == streamPayload?.callId) {
        if (isActive) {
          let payload = {
            id: recentActive?._id,
            isActive: false,
          };
          removeRecentLiveStream(payload, socket, id == streamPayload?.callId);
        }
      }
    });
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  const removeRecentLiveStream = async (data, socket, showMessage) => {
    let response = await changeStatusApi(data);
    if (response?.data.success) {
      if (!showMessage) {
        toast(response?.data?.description);
      }
      socket.emit("sendReqToMasterApi", {
        id: streamPayload?.callId,
        isActive: false,
      });
      call?.stopLive();
      call?.endCall();
      setStreamPayload(null);
      setStreamUrl(null);
      router.replace("/table-view");
    }
  };

  const changeStatusHandler = async (data, isTimeOut) => {
    let response = await changeStatusApi(data);
    if (response?.data.success) {
      toast(
        isTimeOut
          ? "Stream request time out"
          : isTimeOut == false
          ? "Stream request cancelled"
          : response?.data?.description
      );
      socket.emit("sendReqToMasterApi", {
        id: streamPayload?.callId,
        isActive: false,
        stopByUser: data?.stopByUser,
      });
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
      tableNo: streamPayload?.tableNo != "null" ? streamPayload?.tableNo : 0,
      userId: streamPayload?.user_id,
      callId: streamPayload?.callId,
      token: streamPayload?.token,
    };
    const response = await sendStreamReqApi(payload);

    if (response?.data.success) {
      socket?.emit("sendReqToMasterApi", {
        id: streamPayload?.callId,
        isActive: true,
        streamPayload: streamPayload,
      });
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
            setIsActive(false);
            setIsRequestSent(false);
            let payload = {
              id: content?._id,
              isActive: false,
            };
            changeStatusHandler(payload, true);
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
    setIsRequestSent(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {isActive && (
        <div className="text-white text-md px-5">
          {`Your request has been sent to master: `}
          <span className="countdown font-mono text-lg  text-white">
            <span style={{ "--value": timer }}> </span>
            {` sec`}
          </span>
        </div>
      )}
      <div className="flex w-full h-[100vh]">
        {localParticipant && (
          <ParticipantView
            participant={localParticipant}
            ParticipantViewUI={null}
          />
        )}
      </div>
      <div className="text-white sticky bottom-0 flex ">
        {currentLive != streamPayload?.callId && (
          <div className="w-full p-2">
            <button
              className="btn btn-primary bg-primary border-0 hover:bg-yellow-500  w-full text-black"
              onClick={() => {
                if (!isCallLive) {
                  call?.endCall();
                  setStreamPayload(null);
                  setStreamUrl(null);
                  router.replace("./table-view");
                } else {
                  let payload = {
                    id: content?._id,
                    isActive: false,
                  };
                  changeStatusHandler(payload, false);
                }
              }}
            >
              Cancel Stream Request
            </button>
          </div>
        )}
        {isCallLive && currentLive == streamPayload?.callId && (
          <div className="w-full p-2">
            <button
              className="btn btn-primary bg-primary border-0 w-full text-sm hover:bg-yellow-500 text-black"
              onClick={() => {
                let payload = {
                  id: content?._id,
                  isActive: false,
                  stopByUser: true,
                };
                changeStatusHandler(payload);
              }}
            >
              Stop Livestream
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveVideo;
