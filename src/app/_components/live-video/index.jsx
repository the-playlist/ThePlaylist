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
const CALL_ID = "CALL_ID";

const LiveVideo = ({ streamPayload, setStreamPayload, tableno }) => {
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
          tableno={tableno}
        />
      </StreamCall>
    </StreamVideo>
  );
};

export const MyLivestreamUI = ({
  streamPayload,
  setStreamPayload,
  tableno,
}) => {
  const router = useRouter();
  const call = useCall();
  const { useIsCallLive, useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const isCallLive = useIsCallLive();
  const [changeStatusApi] = useChangeStreamRequestStatusMutation();
  const [sendStreamReqApi] = useSendStreamRequestMutation();
  const [timer, setTimer] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [content, setContent] = useState({});
  const [socket, setSocket] = useState();
  const [currentLive, setCurrentLive] = useState(null);

  // This method below will be decline any on the requests by the Use if he kill or go back from the Application
  useEffect(() => {
    const handleBrowserState = async (active) => {
      if (!active) {
        let payload = {
          id: localStorage.getItem(CALL_ID),
          stopByUser: true,
          isActive: false,
        };
        // await changeStatusHandler(payload, false);
      }
    };
    const handleFocus = () => handleBrowserState(true);
    const handleBlur = () => handleBrowserState(false);
    // window.addEventListener("popstate", () => {
    //   handleBlur();
    // });
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      // window.removeEventListener("popstate", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    if (socket != undefined) {
      streamRequestHandler();
    }
  }, [socket]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
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

          router.replace(`/table-view?tableno=${tableno}`);
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
      const { activeStream } = response?.data?.content;

      if (!showMessage) {
        toast(response?.data?.description);
      }
      socket.emit("sendReqToMasterApi", {
        id: streamPayload?.callId,
        isActive: false,
        activeStream: activeStream,
      });
      call?.stopLive();
      call?.endCall();
      setStreamPayload(null);

      router.replace(`/table-view?tableno=${tableno}`);
    }
  };

  const changeStatusHandler = async (data, isTimeOut) => {
    let response = await changeStatusApi(data);
    if (response?.data.success) {
      const { activeStream } = response?.data?.content;
      toast(
        isTimeOut
          ? "Stream request time out"
          : isTimeOut == false
          ? "Stream request cancelled"
          : response?.data?.description
      );
      let socketConnection = socket;

      if (!socketConnection) {
        socketConnection = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
          autoConnect: false,
        });
        socketConnection.connect();
      }
      socketConnection.emit("sendReqToMasterApi", {
        id: streamPayload?.callId,
        isActive: false,
        stopByUser: data?.stopByUser || true,
        activeStream: activeStream,
      });
      call?.stopLive();
      call?.endCall();
      setStreamPayload(null);
      router.replace(`/table-view?tableno=${tableno}`);
    }
  };

  const streamRequestHandler = async () => {
    let payload = {
      url: null,
      tableno:
        streamPayload?.tableno != "null" ? streamPayload?.tableno : tableno,
      userId: streamPayload?.user_id,
      callId: streamPayload?.callId,
      token: streamPayload?.token,
    };
    const response = await sendStreamReqApi(payload);

    if (response?.data.success) {
      const { request, activeStream } = response?.data?.content;
      socket?.emit("sendReqToMasterApi", {
        id: streamPayload?.callId,
        isActive: true,
        streamPayload: streamPayload,
        activeStream: activeStream,
      });
      localStorage.setItem(CALL_ID, request?._id);
      setContent(request);
      toast(response?.data?.description);
      handleClick();
    } else {
      toast.error(response?.data?.description);
      router.back();
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
            let payload = {
              id: content?._id,
              isActive: false,
            };
            changeStatusHandler(payload, true);
            return 300;
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
    setTimer(300);
  };
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {isActive && (
        <div className="text-white text-md px-5">
          {`Your request has been sent to master: `}
          <span className="countdown font-mono text-lg  text-white">
            {/* <span style={{ "--value": timer }}> </span> */}
            {`${formatTime(timer)}`}
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
                  router.replace(`/table-view?tableno=${tableno}`);
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
