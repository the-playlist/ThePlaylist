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
import { Listener_URL } from "@/app/_utils/common/constants";
import { IoMdAdd, IoIosRemove } from "react-icons/io";
import CustomLoader from "../custom_loader";

const AppearanceTabs = () => {
  const [getThemeListApi, getThemeListRes] = useLazyGetThemeListQuery();
  const [getLimitListApi, getLimitListRes] = useLazyGetLimitListQuery();
  const [addUpdateThemeApi] = useAddUpdateThemeMutation();
  const [addUpdateLimitApi] = useAddUpdateLimitMutation();

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const [modeList, setModeList] = useState(null);
  const [limitList, setLimitList] = useState(null);

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = io(Listener_URL, { autoConnect: false });
    socket.connect();
    setSocket(socket);
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
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
      socket.emit("themeChangeByMasterApi", { title: payload?.title });
      getThemeApiHandler();
    }
  };
  const addUpdateLimitHandler = async (payload) => {
    let response = await addUpdateLimitApi(payload);
    if (response && !response.isError) {
      toast.success(response?.data?.description);
      getThemeApiHandler();
    }
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
      setLimitList(response?.data?.content);
    }
  };

  return (
    <div className="container mx-auto  py-8 ">
      <div className="flex mb-4 w-full relative bg-white drop-shadow rounded-3xl px-4 py-3">
        <button
          onClick={() => handleTabClick(1)}
          className={`p-3 w-1/2 rounded-xl text-black font-bold`}
        >
          Customer Limits
        </button>
        <div
          className={`absolute drop-shadow font-bold  transform transition-transform duration-300 text-white  p-3 w-1/2 bg-primary rounded-xl text-center ${
            activeTab == 2 ? " translate-x-[96%]" : ""
          }`}
        >
          {activeTab == 1 ? "Customer Limits" : "Appearance"}
        </div>
        <button
          onClick={() => handleTabClick(2)}
          className={`p-3 w-1/2 rounded-xl text-black font-bold`}
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
            <CustomLoader />
          ) : (
            limitList?.map((item, index) => {
              return (
                <div className=" bg-white py-4 px-3 rounded-lg drop-shadow mb-5">
                  <span className="text-lg font-semibold">{item?.heading}</span>
                  <div className=" flex justify-between items-center mt-3">
                    <div className="  w-3/4">
                      <div className=" flex items-center w-full">
                        <span>{item?.title}:</span>
                        <div className=" bg-white rounded-sm drop-shadow border w-1/3 flex  ml-2 mr-5 h-12  ">
                          <button
                            disabled={item?.value == 0}
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
                            className="w-full  text-center m-auto focus:outline-none"
                            value={item?.value}
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
                            <span>{item?.subTitle}:</span>
                            <div className=" bg-white rounded-sm drop-shadow border w-1/3 flex  mx-2 h-12 p-1 ">
                              <input
                                type="number"
                                className="w-full px-3  focus:outline-none"
                                value={item?.time}
                                onChange={(e) => {
                                  changeLimitHandler(
                                    item?._id,
                                    "time",
                                    e?.target?.value,
                                    item?.heading
                                  );
                                }}
                              />
                              <div className="p-2 flex items-center justify-center  text-center text-sm bg-gray-300">
                                Min
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="  w-1/3">
                      <GenericButton
                        text="Update"
                        onClick={() => {
                          let payload;
                          if (index == 2) {
                            payload = {
                              heading: item?.heading,
                              value: item?.value,
                            };
                          } else {
                            payload = {
                              heading: item?.heading,
                              value: item?.value,
                              time: item?.time,
                            };
                          }
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

export default AppearanceTabs;

{
  /* <div className="flex items-center justify-center">
                    
                    <label
                      htmlFor="toggle"
                      className="flex items-center cursor-pointer"
                    >
                        
                      <div className="relative">
                        <div className="absolute left-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out"></div>

                        <div className="absolute right-0 w-6 h-6 bg-gray-800 rounded-full shadow-md transform transition-transform duration-300 ease-in-out"></div>

                        <div
                          className={`  bg-gray-300 rounded-full shadow-md cursor-pointer transform transition-transform duration-300 ${
                            isDarkMode ? "translate-x-4" : ""
                          }`}
                        >
                          <span className="ml-2 text-lg">
                            {isDarkMode ? "Dark Mode" : "Light Mode"}
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        id="toggle"
                        className="sr-only"
                        checked={isDarkMode}
                        onChange={toggleTheme}
                      />
                    </label>
                  </div> */
}
