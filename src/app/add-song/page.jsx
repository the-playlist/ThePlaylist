"use client";
import React, { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import {
  useLazyGetOnDutyPlayerSongListQuery,
  useLazyGetAssignSongsWithPlayersQuery,
  useAddSongsToPlaylistMutation,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Typeahead = () => {
  const [getAssignSongsApi, getAssignSongsResponse] =
    useLazyGetAssignSongsWithPlayersQuery();

  const [addSongToPlaylistApi, AddSongsToPlaylistResponse] =
    useAddSongsToPlaylistMutation();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState();
  const [songsListApi, songsListResponse] =
    useLazyGetOnDutyPlayerSongListQuery();
  const [songList, setSongList] = useState([]);

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
        let data = response?.data?.content;
        setFilteredOptions(data);
        setSongList(data);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  const addSongsHandler = async () => {
    let payload = {
      songData: selectedSong?._id,
      assignedPlayer: record?.selectedPlayers?._id,
      sortOrder: index,
    };
    // try {
    //   let response = await addSongToPlaylistApi(data);
    //   if (response && !response.error) {
    //     toast.success(response?.data?.description);
    //   }
    // } catch (error) {
    //   toast.success(error?.message || "Something went wrong.");
    // }
  };
  return (
    <>
      <div className="fixed top-0 left-0  bg-white right-0 flex  p-4">
        <div className="relative flex border-[1px] border-[#F0F0F0] w-full rounded-lg">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className=" border-0 border-[#F0F0F0] placeholder-[#A0A0A0] text-gray-900 text-sm rounded-lg pl-10 pr-4 py-3 w-full focus:ring-black "
            placeholder="Search"
          />
          <svg
            className="absolute top-0 left-0 w-6 h-6 mt-2 ml-3 text-[#A0A0A0]"
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
        <div className="mt-10 flex items-center justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <ul className=" z-10 w-full  bg-white  mt-10 mb-32 overflow-y-auto ">
          {filteredOptions?.map((option) => (
            <div className="border-b-1 border-gray-300">
              <button
                className={`flex w-full items-center rounded-md px-3  py-1 my-1 bg-${
                  selectedSong == option ? "top-queue-bg" : "white"
                }`}
                onClick={() => {
                  setInputValue(option.title);
                  setSelectedSong(option);
                }}
              >
                <div
                  className={` h-4 w-4 
                  ${
                    selectedSong?._id == option?._id
                      ? "  border-4"
                      : "  border-2"
                  }
                ${
                  selectedSong?._id == option?._id
                    ? " border-white"
                    : " border-gray-300"
                }
                  rounded-full
                  `}
                ></div>
                <li
                  key={option.id}
                  className="pl-4 py-2 cursor-pointer flex w-full justify-between  items-center"
                >
                  <span className=" text-sm text-black font-bold">
                    {option.title}
                  </span>
                  <span className="text-sm text-black">{option.artist}</span>
                </li>
              </button>
            </div>
          ))}
        </ul>
      )}
      <div className="fixed bottom-0 left-0 w-full bg-white flex justify-end p-4">
        <button
          disabled={inputValue?.length == 0}
          onClick={() => {
            router.back();
            setInputValue("");
            setSelectedSong(null);
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
    <div className="overflow-x-auto bg-white h-screen overflow-y-scroll mx-auto  px-5 pt-5">
      <div className="mb-2 text-base font-medium text-black">Select a Song</div>
      <Typeahead />
    </div>
  );
};

export default AddSong;
