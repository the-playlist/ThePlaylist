"use client";
import { useEffect, useState } from "react";
import GenericButton from "../generic-button";
import ViewMode from "../view-mode";
import {
  useLazyGetThemeListQuery,
  useAddUpdateThemeMutation,
  useLazyGetLimitListQuery,
  useAddUpdateLimitMutation,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { IoMdAdd, IoIosRemove } from "react-icons/io";
import { Tooltip, Button } from "@nextui-org/react";
import { FaCircleInfo } from "react-icons/fa6";
import { CustomLoader } from "../custom_loader";
import { useSelector } from "react-redux";

const LimitAndAppearence = () => {
  const [getThemeListApi, getThemeListRes] = useLazyGetThemeListQuery();
  const [getLimitListApi, getLimitListRes] = useLazyGetLimitListQuery();
  const [addUpdateThemeApi] = useAddUpdateThemeMutation();
  const [addUpdateLimitApi] = useAddUpdateLimitMutation();
  const [activeTab, setActiveTab] = useState(1);
  const [btnLoader, setBtnLoader] = useState(null);
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );
  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const [modeList, setModeList] = useState(null);
  const [limitList, setLimitList] = useState(null);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();
    setSocket(socket);
  }, []);

  const changeModeStatus = (id, status, title) => {
    setModeList((prevModeList) =>
      prevModeList.map((list) =>
        list._id === id ? { ...list, mode: status } : list
      )
    );
    let payload = {
      title: title,
      mode: status,
    };
    addUpdateThemeHandler(payload);
  };

  const changeLimitHandler = (id, mode, value, heading) => {
    if (mode == "time") {
      setLimitList((prevLimitList) =>
        prevLimitList.map((list) =>
          list._id === id
            ? {
                ...list,
                time: value,
              }
            : list
        )
      );
    } else if (mode == "message") {
      setLimitList((prevLimitList) =>
        prevLimitList.map((list) =>
          list._id === id
            ? {
                ...list,
                message: value,
              }
            : list
        )
      );
    } else {
      setLimitList((prevLimitList) =>
        prevLimitList.map((list) =>
          list._id === id
            ? {
                ...list,
                value: mode == "add" ? list?.value + 1 : list?.value - 1,
              }
            : list
        )
      );
    }
  };

  useEffect(() => {
    getThemeApiHandler();
    getLimitApiHandler();
  }, []);

  const addUpdateThemeHandler = async (payload) => {
    let response = await addUpdateThemeApi(payload);
    if (response && !response.isError) {
      toast.success(response?.data?.description);
      socket.emit("themeChangeByMasterApi-v2", { title: payload?.title });
      getThemeApiHandler();
    }
  };
  const addUpdateLimitHandler = async (payload) => {
    let response = await addUpdateLimitApi(payload);
    if (response && !response.isError) {
      toast.success(response?.data?.description);
      socket.emit("limitChangeByMasterApi", { title: payload?.heading });
      getThemeApiHandler();
    }
    setBtnLoader(null);
  };

  const getThemeApiHandler = async () => {
    let response = await getThemeListApi();
    if (response && !response.isError) {
      setModeList(response?.data?.content);
    }
  };

  const getLimitApiHandler = async () => {
    let response = await getLimitListApi();
    if (response && !response.isError) {
      const { list, activeStream } = response?.data?.content;
      setLimitList(list);
    }
  };

  const getToolTipMsg = (heading, value, time) => {
    if (heading == "Vote Limit") {
      return `A customer can cast ${value} ${
        value == 1 ? "vote" : "votes"
      } in ${time} ${time == 1 ? "minute" : "minutes"}`;
    } else if (heading == "Song Limit") {
      return `A customer can add ${value} ${
        value == 1 ? "song" : "songs"
      } in ${time} ${time == 1 ? "minute" : "minutes"}`;
    } else if (heading == "Queue Limit") {
      return `${value} ${
        value == 1 ? "song" : "songs"
      } can be added in the playlist`;
    } else if (heading == "Perform Request Limit") {
      return `user can request ${value} ${
        value == 1 ? "song" : "songs"
      } to perform in ${time} ${time == 1 ? "minute" : "minutes"}`;
    } else {
      return `${value} live ${
        value == 1 ? "request" : "requests"
      } can be received at a time.`;
    }
  };

  return (
    <div className="container mx-auto  py-8 ">
      <div
        className={`flex mb-4 w-full relative  ${masterViewTheme ? "bg-white text-black" : "bg-light-tile text-white"} drop-shadow rounded-3xl px-4 py-3`}
      >
        <button
          onClick={() => handleTabClick(1)}
          className={`p-3 w-1/2 rounded-xl font-bold`}
        >
          Customer Limits
        </button>
        <div
          className={`absolute drop-shadow font-bold  transform transition-transform duration-300 ${masterViewTheme ? "text-white" : "text-black"}  p-3 w-1/2 bg-primary rounded-xl text-center ${
            activeTab == 2 ? " translate-x-[96%]" : ""
          }`}
        >
          {activeTab == 1 ? "Customer Limits" : "Appearance"}
        </div>
        <button
          onClick={() => handleTabClick(2)}
          className={`p-3 w-1/2 rounded-xl  font-bold`}
        >
          Appearance
        </button>
      </div>
      <div className="">
        <div
          className={`tab-content ${
            activeTab === 1 ? "block" : "hidden"
          } transition-opacity duration-500`}
        >
          {getLimitListRes?.isFetching ? (
            <CustomLoader bgColor={masterViewTheme ? "bg-dark" : "bg-light"} />
          ) : (
            limitList?.map((item, index) => {
              return (
                <div
                  className={`${masterViewTheme ? "bg-white text-black" : "bg-light-tile text-white"}  py-4 px-3 rounded-lg drop-shadow mb-5`}
                >
                  <div className="flex items-center">
                    <span className="text-lg font-semibold">
                      {item?.heading}
                    </span>
                    <Tooltip
                      offset={-20}
                      showArrow={true}
                      placement={"right"}
                      color="foreground"
                      content={
                        <>
                          <span className="p-3 text-white">
                            {getToolTipMsg(
                              item?.heading,
                              item?.value,
                              item?.time
                            )}
                          </span>
                        </>
                      }
                    >
                      <Button
                        hideArrow={false}
                        flat
                        auto
                        color="null"
                        className="capitalize p-0 -ml-5"
                      >
                        <FaCircleInfo size={20} />
                      </Button>
                    </Tooltip>
                  </div>
                  <div className=" flex justify-between items-center mt-3">
                    <div className="  w-3/4">
                      <div className=" flex items-center w-full">
                        <span className="font-semibold ">{item?.title}:</span>
                        <div
                          className={` ${masterViewTheme ? "bg-white text-black border" : "bg-dark text-white"} rounded-md drop-shadow  w-1/4 flex  ml-2 mr-5 h-12  `}
                        >
                          <button
                            disabled={item?.value == 1}
                            onClick={() => {
                              changeLimitHandler(
                                item?._id,
                                "subtract",
                                item?.value + 1,
                                item?.heading
                              );
                            }}
                            className="p-3   border-r text-center text-lg"
                          >
                            <IoIosRemove />
                          </button>
                          <input
                            className="w-full disabled:bg-inherit  text-center m-auto focus:outline-none "
                            value={item?.value}
                            disabled={true}
                          />
                          <button
                            onClick={() => {
                              changeLimitHandler(
                                item?._id,
                                "add",
                                item?.value + 1,
                                item?.heading
                              );
                            }}
                            className="p-3  border-l  text-center text-lg"
                          >
                            <IoMdAdd />
                          </button>
                        </div>

                        {item?.subTitle && (
                          <>
                            <span className="font-semibold ">
                              {item?.subTitle}:
                            </span>
                            <div
                              className={` ${masterViewTheme ? "bg-white text-black border" : "bg-dark text-white"} rounded-md drop-shadow  w-1/4 flex  mx-2 h-12 p-1 mr-5 `}
                            >
                              <input
                                type="number"
                                className={`w-full px-3 disabled:bg-inherit focus:outline-none ${masterViewTheme ? "bg-white" : "bg-dark"} `}
                                value={item?.time}
                                min="1"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const limitedValue = value < 1 ? 1 : value;

                                  changeLimitHandler(
                                    item?._id,
                                    "time",
                                    limitedValue,
                                    item?.heading
                                  );
                                }}
                              />
                              <div
                                className={`p-2 flex items-center justify-center font-semibold text-center text-sm ${masterViewTheme ? " text-[#989B9E] bg-[#F2F2F2]" : "bg-light-tile text-white"} rounded-sm`}
                              >
                                Min
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    {item?.isMessage && (
                      <div className=" w-full items-center">
                        <span className=" font-semibold  ">Alert Message:</span>

                        <div
                          className={`${masterViewTheme ? "bg-white text-black" : "bg-dark text-white"}  rounded-md     w-[57%] flex mt-1 h-11 p-1 mr-5 `}
                        >
                          <input
                            type="text"
                            className={`w-full px-3 text-sm rounded-md  disabled:bg-inherit focus:outline-none ${masterViewTheme ? "bg-white text-black" : "bg-dark text-white"}`}
                            onChange={(e) => {
                              const value = e.target.value;
                              changeLimitHandler(
                                item?._id,
                                "message",
                                value,
                                item?.heading
                              );
                            }}
                            value={item?.message}
                          />
                        </div>
                      </div>
                    )}
                    <div className="  w-1/4">
                      <GenericButton
                        disabled={
                          btnLoader == index || item?.message?.length > 0
                            ? false
                            : true
                        }
                        loading={index == btnLoader}
                        text="Update"
                        onClick={() => {
                          let payload;
                          if (index < 2 || index == 4) {
                            payload = {
                              heading: item?.heading,
                              value: item?.value,
                              time: item?.time,
                              message: item?.message,
                            };
                          } else {
                            payload = {
                              heading: item?.heading,
                              value: item?.value,
                              message: item?.message,
                            };
                          }
                          setBtnLoader(index);
                          addUpdateLimitHandler(payload);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div
          className={`tab-content ${
            activeTab === 2 ? "block" : "hidden"
          } transition-opacity duration-500`}
        >
          <div className=" ">
            <div className="flex flex-col gap-3 ">
              {getThemeListRes?.isFetching ? (
                <CustomLoader />
              ) : (
                modeList?.map((item) => {
                  return (
                    <ViewMode
                      btnText1={"Light"}
                      btnText2={"Dark"}
                      title={item?.title}
                      isLight={item?.mode}
                      onLightModePress={() => {
                        changeModeStatus(item?._id, true, item?.title);
                      }}
                      onDarkModePress={() => {
                        changeModeStatus(item?._id, false, item?.title);
                      }}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimitAndAppearence;
