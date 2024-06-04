"use client";
import React, { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import {
  useLazyGetOnDutyPlayerSongListQuery,
  useLazyGetAssignSongsWithPlayersQuery,
  useAddSongToPlaylistByCustomerMutation,
  useLazyGetLimitByTitleQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Listener_URL } from "../_utils/common/constants";
import { io } from "socket.io-client";

const Typeahead = () => {
  let limitTitle = "Song Limit";
  const [getLimitByTitleApi] = useLazyGetLimitByTitleQuery();
  const [getAssignSongsApi, getAssignSongsResponse] =
    useLazyGetAssignSongsWithPlayersQuery();
  const [addSongToPlaylistByUserApi] = useAddSongToPlaylistByCustomerMutation();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState();
  const [songsListApi] = useLazyGetOnDutyPlayerSongListQuery();
  const [songList, setSongList] = useState([]);
  const [socket, setSocket] = useState();
  const [songLimit, setSongLimit] = useState(null);

  useEffect(() => {
    const socket = io(Listener_URL, { autoConnect: false });
    socket.on("limitChangeByMasterRes", (item) => {
      const { title } = item;
      if (limitTitle == title) {
        getLimitByTitleHandler(title);
      }
    });
    socket.connect();
    setSocket(socket);

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value === "") {
      setFilteredOptions(songList);
      return;
    }
    const filtered = songList.filter((option) =>
      option.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleClearClick = () => {
    setInputValue("");
    setSelectedSong(null);
    setFilteredOptions(songList);
  };
  useEffect(() => {
    fetchSongsList();
    fetchAssignSongsList();
    getLimitByTitleHandler(limitTitle);
  }, []);

  const fetchSongsList = async () => {
    let response = await songsListApi();
    if (response && !response.isError) {
      const songList = response.data?.content;
      setFilteredOptions(songList);
      setSongList(songList);
    }
  };
  const fetchAssignSongsList = async () => {
    try {
      let response = await getAssignSongsApi(null);
      if (response && !response.isError) {
        let data = response?.data?.content?.list;
        setFilteredOptions(data);
        setSongList(data);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const handleSong = (id) => {
    const currentTime = new Date().getTime();
    const prevSongTime = parseInt(localStorage.getItem("prevSongTime"), 10);
    const songCount = parseInt(localStorage.getItem("songCount"), 10) || 0;
    const timeLimit = songLimit?.time * 60000;
    const songCountLimit = songLimit?.value;

    if (!prevSongTime) {
      localStorage.setItem("prevSongTime", currentTime);
      localStorage.setItem("songCount", 1);
      addSongsHandler(id);
      return;
    }
    const timeDifference = currentTime - prevSongTime;
    if (timeDifference > timeLimit) {
      localStorage.setItem("prevSongTime", currentTime);
      localStorage.setItem("songCount", 1);
      addSongsHandler(id);
    } else {
      if (songCount < songCountLimit) {
        localStorage.setItem("songCount", songCount + 1);
        addSongsHandler(id);
      } else {
        toast.error("Song limit reached. Please try again later.");
      }
    }
  };
  const addSongsHandler = async (id) => {
    try {
      let response = await addSongToPlaylistByUserApi({
        songId: id,
        addByCustomer: true,
      });
      if (response && !response.error) {
        const { isFirstTimeFetched } = response?.data?.content;
        localStorage.setItem("isFirstTimeFetched", isFirstTimeFetched);
        toast.success(response?.data?.description);
        socket.emit("addSongToPlaylistApi", id);
        setInputValue("");
        setSelectedSong(null);
        router.back();
      }
    } catch (error) {
      toast.success(error?.message || "Something went wrong.");
    }
  };

  const getLimitByTitleHandler = async (title) => {
    let response = await getLimitByTitleApi(title);
    if (response && !response.isError) {
      const songLimit = response?.data?.content;
      setSongLimit(songLimit);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0  bg-[#1F1F1F] right-0   p-4">
        <div className="mb-2 text-base font-medium text-white">
          Select a Song
        </div>
        <div className="relative flex  bg-[#303134]  w-full rounded-lg">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className=" bg-[#303134]  placeholder-[#A0A0A0] text-sm rounded-lg pl-10 pr-4 py-3 w-full focus:ring-black text-white "
            placeholder="Search"
          />
          <svg
            className="absolute top-0 left-0 w-6 h-6 mt-2 ml-3 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M20 20l-4.172-4.172M12 18a6 6 0 100-12 6 6 0 000 12z" />
          </svg>
          {inputValue && (
            <button
              className="absolute right-0 top-1 hover:pointer rounded-r-lg px-4 py-2 "
              onClick={handleClearClick}
            >
              <MdClear size={20} />
            </button>
          )}
        </div>
      </div>
      {getAssignSongsResponse?.isFetching ? (
        <div className="mt-24 flex items-center justify-center">
          <span className="loading loading-spinner loading-md bg-white"></span>
        </div>
      ) : filteredOptions?.length > 0 ? (
        <ul className="z-10 w-full  bg-[#1F1F1F] mt-20 mb-32 overflow-y-auto ">
          {filteredOptions?.map((option) => (
            <div className="border-b-1 border-[#323335]">
              <button
                className={`flex w-full items-center rounded-md px-3  py-1 my-1 bg-${
                  selectedSong == option ? "top-queue-bg" : "[#1F1F1F]"
                }`}
                onClick={() => {
                  setInputValue(option.title);
                  setSelectedSong(option);
                }}
              >
                <div
                  className={` h-4 w-4 
                  ${
                    selectedSong?._id == option?._id ? " border-4" : " border-2"
                  }
                ${
                  selectedSong?._id == option?._id
                    ? " border-black"
                    : " border-[#FFFFFF]"
                }
                  rounded-full
                  `}
                ></div>
                <li
                  key={option.id}
                  className="pl-4 py-2 cursor-pointer flex w-full justify-between  items-center"
                >
                  <span
                    className={`text-sm text-${
                      selectedSong?._id == option?._id ? "black" : "white"
                    } font-bold`}
                  >
                    {option.title}
                  </span>
                  <span
                    className={`text-sm text-${
                      selectedSong?._id == option?._id ? "black" : "white"
                    }`}
                  >
                    {option.artist}
                  </span>
                </li>
              </button>
            </div>
          ))}
        </ul>
      ) : (
        <div className="text-white h-[100vh] flex items-center justify-center text-lg  ">
          No Songs Found
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full bg-[#1F1F1F] flex justify-end p-4">
        <button
          disabled={inputValue?.length == 0}
          onClick={() => {
            handleSong(selectedSong?._id);
          }}
          className={`flex w-full items-center ${
            inputValue?.length > 0 ? "bg-top-queue-bg" : "bg-gray-200"
          }  hover:text-black text-black font-bold py-3 px-4 rounded-md justify-center `}
        >
          <span
            className={`text-base text-${
              inputValue?.length > 0 ? "black" : "white"
            }`}
          >
            Add
          </span>
        </button>
      </div>
    </>
  );
};
const AddSong = () => {
  return (
    <div className="overflow-x-auto bg-[#1F1F1F] h-screen overflow-y-scroll mx-auto  px-5 pt-5">
      <Typeahead />
    </div>
  );
};

export default AddSong;
