"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  useChangeStreamRequestStatusMutation,
  useLazyGetStreamRequestQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { CurrentLiveVideo } from "@/app/_components";
import { Togglebutton } from "./toggle-button";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setIsWallViewOrJumbotron,
  setStreamContent,
} from "@/app/_utils/redux/slice/playlist-list";
import { JUMBOTRON_VIEW, WALL_VIEW } from "@/app/_utils/common/constants";
import { VideoStreamUI } from "./video-stream-ui";
import { CustomLoader } from "@/app/_components/custom_loader";

const StreamResponse = () => {
  const dispatch = useDispatch();
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );
  const viewMode_ = useSelector(
    (state) => state?.playlistReducer?.isWallViewOrJumbotron
  );
  const streamContent = useSelector(
    (state) => state?.playlistReducer?.streamContent
  );
  const [socket, setSocket] = useState();
  const [getStreamRequestListApi, getStreamRequestResponse] =
    useLazyGetStreamRequestQuery();
  const [changeStatusApi, changeStatusResponse] =
    useChangeStreamRequestStatusMutation();
  // const [streamContent, setStreamContent] = useState([]);
  const [streamAcceptedContent, setStreamAcceptedContent] = useState([]);
  const [statusChangeLoader, setStatusChangeLoader] = useState(false);

  const [loading, setLoading] = useState(true);
  const [recentActive, setRecentActive] = useState(null);
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();
    setSocket(socket);
    socket.on("sendReqToMasterRes", (item) => {
      const { stopByUser, streamPayload } = item;
      if (stopByUser) {
        // NOTE: as per umer request this toaster is blocked
        // toast("Stream has been stopped by user");
        getStreamRequestHandler();
      } else if (streamPayload) {
        getStreamRequestHandler();
      }
    });

    // socket.on("acceptedRejectStreamRes", (item) => {
    //   getStreamRequestHandler();
    // });
  }, []);

  useEffect(() => {
    getStreamRequestHandler();
  }, []);

  const getStreamRequestHandler = async () => {
    let response = await getStreamRequestListApi();
    if (response?.data?.success) {
      const {
        content: { isAcceptedRequests, isActiveRequests },
      } = response?.data;
      dispatch(setStreamContent(isActiveRequests));
      setStreamAcceptedContent(isAcceptedRequests[0]);
      if (isAcceptedRequests[0]?.isAccepted) {
        setRecentActive(isAcceptedRequests[0]);
      } else {
        setRecentActive(null);
      }
    }
    setLoading(false);
  };

  const changeStatusHandler = async (data) => {
    dispatch(setStreamContent(streamContent.filter((i) => i._id != data.id)));
    setStatusChangeLoader(true);
    let response = await changeStatusApi(data);
    if (response?.data.success) {
      setStatusChangeLoader(false);

      const { activeStream } = response?.data?.content;
      getStreamRequestHandler();
      socket.emit("acceptedRejectStreamReq", {
        id: data?.callId,
        isActive: data?.isActive ? true : false,
        recentActive: recentActive,
        activeStream: activeStream,
        isHideToast: data?.isHideToast,
      });
    }
  };

  const onToggleViewBtnPress = () => {
    socket.emit("wallViewJumbotronRequest", {
      screenName: viewMode_ === WALL_VIEW ? JUMBOTRON_VIEW : WALL_VIEW,
    });
  };

  return (
    <div className="min-h-screen py-10 ">
      {loading ? (
        <CustomLoader bgColor={masterViewTheme ? "bg-dark" : "bg-light"} />
      ) : (
        <div className=" h-[90vh] overflow-y-scroll pb-10">
          <Togglebutton
            onLightModePress={() => {
              dispatch(setIsWallViewOrJumbotron(WALL_VIEW));
              onToggleViewBtnPress();
            }}
            onDarkModePress={() => {
              dispatch(setIsWallViewOrJumbotron(JUMBOTRON_VIEW));
              onToggleViewBtnPress();
            }}
            isLight={viewMode_ === WALL_VIEW}
            btnText1={"Wall View"}
            btnText2={"Jumbotron"}
          />
          {streamAcceptedContent && (
            <div className="flex w-full flex-col">
              <span className=" text-lg font-semibold mb-2">Live View</span>
              <CurrentLiveVideo
                item={streamAcceptedContent}
                socket={socket}
                onStopClick={() => {
                  let payload = {
                    callId: streamAcceptedContent?.callId,
                    id: streamAcceptedContent?._id,
                    isActive: false,
                  };
                  if (!statusChangeLoader) {
                    changeStatusHandler(payload);
                  }
                }}
              />
            </div>
          )}
          {streamContent?.length > 0 ? (
            <>
              <span
                className={` text-lg font-semibold mb-4  ${masterViewTheme ? "text-black" : "text-white"}`}
              >
                Requests
              </span>
              <div className="flex flex-wrap items-center justify-start ">
                {streamContent.map((item, index) => {
                  return (
                    <VideoStreamUI
                      key={item._id}
                      item={item}
                      socket={socket}
                      changeStatusHandler={(payload) => {
                        if (!statusChangeLoader) {
                          changeStatusHandler(payload);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div
              className={`flex flex-col  ${
                streamAcceptedContent ? "h-[30%]" : "h-full"
              }`}
            >
              {streamAcceptedContent && (
                <span
                  className={` text-lg font-semibold mb-4 mt-2 ${masterViewTheme ? "text-black" : "text-white"}`}
                >
                  Requests
                </span>
              )}
              <div
                className={`${masterViewTheme ? "text-black" : "text-white"} text-lg flex flex-1 items-center justify-center font-semibold`}
              >
                {"No stream requests yet"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamResponse;
