"use client";
import React, { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import {
  useAddSongToPlaylistByCustomerV2Mutation,
  useLazyGetLimitByTitleQuery,
  useLazyGetAddSongListForCustomerV2Query,
  useLazyGetSongsListQuery,
  useRequestToPerformMutation,
  useLazyGetLimitListQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { CustomLoader } from "../_components/custom_loader";

const Typeahead = () => {
  const searchParams = useSearchParams();
  const request_to_perform = searchParams.get("request_perform");
  const table_no = searchParams.get("table_no");

  const [getLimitByTitleApi] = useLazyGetLimitByTitleQuery();
  const [screenLoader, setScreenLoader] = useState(true);
  const [addSongToPlaylistByUserApi, { isLoading }] =
    useAddSongToPlaylistByCustomerV2Mutation();
  const [getAllSongsListApi, { isLoading: allSongLoader }] =
    useLazyGetSongsListQuery();
  const [requestToPerformApi, { isLoading: btnLoader }] =
    useRequestToPerformMutation();
  const [getLimitListApi] = useLazyGetLimitListQuery();

  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState();
  const [songsListApi, getSongsListResponse] =
    useLazyGetAddSongListForCustomerV2Query();
  const [songList, setSongList] = useState([]);
  const [socket, setSocket] = useState();
  const [songLimit, setSongLimit] = useState(null);

  const [songDetail, setSongDetail] = useState({
    title: "",
    playerName: "",
    duration: 0,
    playingState: false,
    id: null,
  });

  let timer;

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.on("limitChangeByMasterRes", (item) => {
      getLimitApiHandler();
    });

    socket.on("songAddByCustomerRes-v2", (item) => {
      // fetchSongsList();
      timer = setTimeout(() => {
        fetchSongsList();
      }, 1000);
    });
    socket.on("insertSongIntoPlaylistResponse-v2", () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        fetchSongsList();
      }, 1000);
    });
    socket.on("RemoveSongFromPlaylistResponse-v2", () => {
      timer = setTimeout(() => {
        fetchSongsList();
      }, 1000);
    });
    socket.on("remainingTimeRes-v2", (item) => {
      const { duration, currentSongDetail, playingState } = item;
      setSongDetail({
        title: currentSongDetail?.title,
        playerName: currentSongDetail?.player,
        duration: duration,
        playingState: playingState,
        id: currentSongDetail?.id,
      });
    });
    if (request_to_perform == "true") {
      console.log("called");
      socket.on("changeSongStatusRes", () => {
        fetchAllSongsList();
      });
    }

    socket.connect();
    setSocket(socket);

    return () => {
      clearTimeout(timer); // Cleanup the timeout if the component is unmounted
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value === "") {
      setFilteredOptions(songList);
      return;
    }
    const filtered = songList.filter(
      (option) =>
        option.title.toLowerCase().includes(value.toLowerCase()) ||
        option.artist.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleClearClick = () => {
    setInputValue("");
    setSelectedSong(null);
    setFilteredOptions(songList);
  };
  useEffect(() => {
    if (request_to_perform == "true") {
      fetchAllSongsList();
    } else {
      fetchSongsList();
    }
    // request_to_perform ? fetchAllSongsList() : fetchSongsList();
    getLimitApiHandler();
    // getLimitByTitleHandler(limitTitle);
  }, [request_to_perform]);

  const fetchAllSongsList = async () => {
    setSelectedSong(null);
    let response = await getAllSongsListApi(false);

    if (response && !response.isError) {
      const songList = response.data?.content;
      setFilteredOptions(songList);
      setSongList(songList);
    }
    setScreenLoader(false);
  };

  const fetchSongsList = async () => {
    try {
      let response = await songsListApi();
      if (response && !response.isError) {
        const songList = response.data?.content;
        setFilteredOptions(songList);
        setSongList(songList);
      }
      setScreenLoader(false);
    } catch (error) {
    } finally {
    }
  };

  const handleSong = (id, song) => {
    const currentTime = new Date().getTime();
    const prevSongTime = parseInt(localStorage.getItem("prevSongTime"), 10);
    const songCount = parseInt(localStorage.getItem("songCount"), 10) || 0;
    const timeLimit = songLimit?.time * 60000;
    const songCountLimit = songLimit?.value;

    if (!prevSongTime) {
      localStorage.setItem("prevSongTime", currentTime);
      localStorage.setItem("songCount", 1);
      addSongsHandler(id, song);
      return;
    }
    const timeDifference = currentTime - prevSongTime;
    if (timeDifference > timeLimit) {
      localStorage.setItem("prevSongTime", currentTime);
      localStorage.setItem("songCount", 1);
      addSongsHandler(id, song);
    } else {
      if (songCount < songCountLimit) {
        localStorage.setItem("songCount", songCount + 1);
        addSongsHandler(id, song);
      } else {
        toast.error(
          songLimit?.message ?? "Song limit reached. Please try again later."
        );
      }
    }
  };

  const addSongsHandler = async (id, song) => {
    try {
      let response = await addSongToPlaylistByUserApi({
        songId: id,
        addByCustomer: true,
        songDetail: songDetail,
        qualifiedPlayers: song?.assignedPlayers,
      });
      if (response && !response.error) {
        toast.success(response?.data?.description);
        setInputValue("");
        setSelectedSong(null);
        socket.emit("songAddByCustomerReq-v2", {});
        router.back();
      } else {
        toast.error(response?.error?.data?.description);
        localStorage.setItem("prevSongTime", null);
        localStorage.setItem("songCount", 0);
      }
    } catch (error) {
      toast.success(error?.message || "Something went wrong.");
      localStorage.setItem("prevSongTime", null);
      localStorage.setItem("songCount", 0);
    }
  };

  const requestToPerformApiHandler = async (payload) => {
    try {
      const response = await requestToPerformApi(payload);

      if (response && !response.error) {
        const { song, playlistCount, list } = response?.data?.content;
        toast.success(response?.data?.description);
        setInputValue("");
        setSelectedSong(null);
        socket.emit("songAddByCustomerReq-v2", {
          playlist: list,
          playlistCount: playlistCount,
        });
        router.back();
      } else {
        toast.error(response?.error?.data?.description);
        localStorage.setItem("prevSongTime", null);
        localStorage.setItem("songCount", 0);
      }
    } catch (error) {}
  };

  const getLimitByTitleHandler = async (title) => {
    let response = await getLimitByTitleApi(title);
    if (response && !response.isError) {
      const songLimit = response?.data?.content;
      setSongLimit(songLimit);
    }
  };

  const getLimitApiHandler = async () => {
    let response = await getLimitListApi();
    if (response && !response.isError) {
      const { list } = response?.data?.content;

      const songLimit = list?.find((item) => item.heading == "Song Limit");
      const requestLimit = list?.find(
        (item) => item?.heading == "Perform Request Limit"
      );

      setSongLimit(songLimit);
    }
  };

  const handleRequestSong = (payload) => {
    requestToPerformApiHandler(payload);
  };
  useEffect(() => {
    if (selectedSong != null) {
      const filterlist = songList?.find(
        (item) => item?._id == selectedSong?._id
      );
      if (filterlist == null) {
        handleClearClick();
      }
      setSelectedSong(filterlist);
    }
  }, [songList]);

  return screenLoader ? (
    <CustomLoader bgColor={"bg-white"} />
  ) : (
    <>
      <div className="fixed top-0 left-0  bg-[#1F1F1F] right-0   p-4">
        <div className="mb-2 text-base font-medium text-white">
          {request_to_perform == "true"
            ? "Select a Song to Perform"
            : "Select a Song"}
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
              className="absolute right-0 top-1  text-white rounded-r-lg px-4 py-2 "
              onClick={handleClearClick}
            >
              <MdClear size={20} />
            </button>
          )}
        </div>
      </div>
      {getSongsListResponse?.isFetching || allSongLoader ? (
        <div className="mt-24 flex items-center justify-center">
          <span
            className={`loading loading-spinner loading-md bg-white `}
          ></span>
        </div>
      ) : filteredOptions?.length > 0 ? (
        <ul className="z-10 w-full  bg-[#1F1F1F] mt-20 mb-32 overflow-y-auto ">
          {filteredOptions?.map((option, index) => (
            <div key={index} className="border-b-1 border-[#323335]">
              <button
                className={`flex w-full items-center rounded-md px-3  py-1 my-1 bg-${
                  selectedSong?._id == option?._id
                    ? "top-queue-bg"
                    : "[#1F1F1F]"
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
                  className="pl-4 py-2 capitalize cursor-pointer flex w-full justify-between  items-center"
                >
                  <span
                    className={`text-sm text-start text-${
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
          onClick={() => {
            router.back();
          }}
          className="w-full text-base flex items-center  bg-[#1F1F1F]  border border-white   font-bold py-3 px-4 rounded-md justify-center text-white "
        >
          <div className="flex items-center justify-center">Go Back</div>
        </button>
        <button
          disabled={selectedSong == null}
          onClick={() => {
            if (request_to_perform == "true") {
              let payload = {
                songId: selectedSong?._id,
                requestToPerform: request_to_perform,
                tableNo: table_no,
              };
              handleRequestSong(payload);
            } else {
              handleSong(selectedSong?._id, selectedSong);
            }
          }}
          className={`flex w-full items-center ml-4 ${
            selectedSong != null ? "bg-top-queue-bg" : "bg-gray-200"
          }   text-black font-bold py-3 px-4 rounded-md justify-center `}
        >
          <span
            className={`text-base text-${
              selectedSong != null ? "black" : "white"
            }`}
          >
            {isLoading || btnLoader ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Add"
            )}
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
