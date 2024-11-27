"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLazyGetThemeByTitleQuery } from "./_utils/redux/slice/emptySplitApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMasterViewTheme } from "./_utils/redux/slice/playlist-list";
import { io } from "socket.io-client";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  let screenName = "Master View";
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();

    socket.on("themeChangeByMasterRes-v2", (item) => {
      const { title } = item;
      if (screenName == title) {
        getThemeByTitleHandler(title);
      }
    });
  }, []);

  const [getThemeByTitleApi] = useLazyGetThemeByTitleQuery();

  useEffect(() => {
    getThemeByTitleHandler(screenName);
  }, []);

  const getThemeByTitleHandler = async (title: string) => {
    let response = await getThemeByTitleApi(title);
    if (response && !response.isError) {
      const { mode } = response?.data?.content;
      dispatch(setMasterViewTheme(mode));
    }
  };

  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
