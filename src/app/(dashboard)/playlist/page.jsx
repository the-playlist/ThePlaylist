"use client";
import React, { useState, useEffect } from "react";
import { FaForward, FaHeart, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { IoArrowUndo } from "react-icons/io5";
import {
  CustomLoader,
  SelectSongModal,
  SongCountdownTimer,
} from "../../_components";
import {
  useLazyGetSongsFromPlaylistQuery,
  useLazyGetAssignSongsWithPlayersQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";

const page = () => {
  const [getPlaylistSongListApi, getPlaylistSongListResponse] =
    useLazyGetSongsFromPlaylistQuery();
  const [getAssignSongsApi, getAssignSongsResponse] =
    useLazyGetAssignSongsWithPlayersQuery();
  const [playlistSongList, setPlaylistSongList] = useState([]);

  useEffect(() => {
    fetchPlaylistSongList();
    fetchAssignSongsList();
  }, []);

  const fetchPlaylistSongList = async () => {
    try {
      let response = await getPlaylistSongListApi(null);

      if (response && !response.isError) {
        setPlaylistSongList(response?.data?.content);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  const dummyArray = [
    {
      id: 0,
      title: "Imagine",
      upVote: "40",
      downVote: "10",
      playerName: "John Lennon",
      intro: "12",
      category: "Standard",
      isFav: true,
      duration: "3:15",
    },
    {
      id: 1,
      title: "Born To Run",
      upVote: "30",
      downVote: "10",
      playerName: "Bruce Springsteen",
      intro: "20",
      category: "Comedy",
      isFav: false,
      duration: "2:00",
    },
    {
      id: 2,
      title: "Hey Jude",
      upVote: "20",
      downVote: "10",
      playerName: "Aretha Franklin",
      intro: "33",
      category: "Ballad",
      isFav: true,
      duration: "2:00",
    },
    {
      id: 3,
      title: "Hey Jude",
      upVote: "20",
      downVote: "10",
      playerName: "Aretha Franklin",
      intro: "33",
      category: "Ballad",
      isFav: false,
      duration: "2:00",
    },
    {
      id: 4,
      title: "Hey Jude",
      upVote: "20",
      downVote: "10",
      playerName: "Aretha Franklin",
      intro: "33",
      category: "Ballad",
      isFav: false,
      duration: "2:00",
    },
    {
      id: 5,
      title: "Hey Jude",
      upVote: "20",
      downVote: "10",
      playerName: "Aretha Franklin",
      intro: "33",
      category: "Ballad",
      isFav: true,
      duration: "2:00",
    },
    {
      id: 6,
      title: "Hey Jude",
      upVote: "20",
      downVote: "10",
      playerName: "Aretha Franklin",
      intro: "33",
      category: "Ballad",
      isFav: true,
      duration: "2:00",
    },
    {
      id: 7,
      title: "Hey Jude",
      upVote: "20",
      downVote: "10",
      playerName: "Aretha Franklin",
      intro: "33",
      category: "Ballad",
      isFav: false,
      duration: "2:00",
    },
    {
      id: 8,
      title: "Hey Jude",
      upVote: "20",
      downVote: "10",
      playerName: "Aretha Franklin",
      intro: "33",
      category: "Ballad",
      isFav: true,
      duration: "2:00",
    },
  ];
  const [arryList, setArrayList] = useState(playlistSongList);
  const [selectSongModal, setSelectSongModal] = useState(false);
  const [assignSongsList, setAssignSongsList] = useState([]);

  const fetchAssignSongsList = async () => {
    try {
      let response = await getAssignSongsApi(null);

      if (response && !response.isError) {
        setAssignSongsList(response?.data?.content);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  return (
    <div className="">
      {getPlaylistSongListResponse?.isFetching ? (
        <CustomLoader />
      ) : (
        <>
          <div className="flex justify-between items-center mx-1 mt-5">
            <button
              onClick={() => {
                const newArray = [...arryList.slice(1)];
                setArrayList(newArray);
              }}
              className="flex items-center hover:cursor-pointer bg-black hover:bg-blue-600 text-white font-bold py-3 px-4 lg:w-1/5 lg:text-xl justify-center rounded"
            >
              <span className="mr-2">Advance the Queue</span>
              <FaForward />
            </button>
            <button className="flex items-center hover:cursor-pointer border border-top-queue-bg hover:bg-blue-500 hover:text-white text-top-queue-bg font-bold py-3 px-4 lg:w-1/5 lg:text-xl justify-center rounded">
              <FaHeart />
              <span className="ml-2">Play Favourite songs</span>
            </button>
          </div>
          <div className="text-base font-medium text-black text-center flex mt-10 mb-5  px-5 ">
            <div className="w-1/12"></div>
            <div className="w-2/12 ">Title</div>
            <div className="w-1/12"></div>
            <div className="w-3/12">Player</div>
            <div className="w-2/12">Intro</div>
            <div className="w-2/12">Category</div>
            <div className="w-1/12"></div>
          </div>
          <div className="overflow-y-auto h-[900px] pb-10 ">
            <div className="border-separate border-spacing-y-5 mb-48 mx-1  ">
              {playlistSongList?.length > 0 &&
                playlistSongList?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={` text-center ${
                        index < 2 ? "bg-top-queue-bg" : "white"
                      }  shadow-lg rounded-2xl h-20 flex items-center mb-4 px-5`}
                    >
                      <div className="w-1/12 text-start font-extrabold text-lg">
                        {index < 2 ? (
                          index + 1
                        ) : (
                          <div className="border flex items-center justify-center text-top-queue-bg border-gray-300 rounded-full h-10 w-10">
                            <HiOutlineArrowsUpDown />
                          </div>
                        )}
                      </div>
                      <div className="w-2/12">{item.title}</div>
                      <div className="w-1/12">
                        {index > 1 && (
                          <div className="flex items-center justify-center">
                            <div className="bg-[#f1f7ee] px-5 mr-2 py-3 flex items-center rounded-3xl">
                              <div className="flex items-center justify-center bg-green-500 rounded-full shadow-xl w-6 h-6 mr-2">
                                <IoIosArrowUp size={18} color={"white"} />
                              </div>
                              {item.upVote}
                            </div>
                            <div className="bg-[#FCEDED] px-5 py-3 flex items-center rounded-3xl">
                              <div className="flex items-center justify-center bg-red-500 rounded-full shadow-xl w-6 h-6 mr-2">
                                <IoIosArrowDown size={18} color={"white"} />
                              </div>
                              {item.downVote}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="w-3/12">{item.playerName}</div>
                      <div className="w-2/12 flex items-center justify-center">
                        <div className="bg-white shadow-xl flex items-center justify-center mt-2 h-10 w-10 rounded-full">
                          {item.introSec}
                        </div>
                      </div>
                      <div
                        className={`w-2/12 flex items-center justify-center `}
                      >
                        <div
                          className={` ${
                            index > 1 ? "bg-[#F7F7F7]" : "bg-white"
                          } rounded-3xl px-5 py-2`}
                        >
                          {item.category}
                        </div>
                      </div>
                      <div className="w-1/12 text-end">
                        {index === 0 ? (
                          <SongCountdownTimer duration={item.songDuration} />
                        ) : index == 1 ? (
                          ""
                        ) : (
                          <div className="flex items-center justify-end ">
                            {item.isFav && (
                              <FaHeart
                                className="text-top-queue-bg"
                                size={20}
                              />
                            )}
                            <button className="ml-5">
                              <FaTrashAlt className="text-red-500" size={20} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="sticky bottom-0 w-full flex justify-end py-4 bg-[#fafafa]">
            <button
              onClick={() => setSelectSongModal(true)}
              className="flex text-base w-1/2 items-center bg-top-queue-bg hover:bg-yellow-500 hover:text-black text-white font-bold py-3 px-4 rounded-md justify-center"
            >
              + Add a Song
            </button>
            <button className="ml-4 w-1/2  text-base flex items-center bg-white  text-black font-bold py-3 px-4 rounded-md justify-center hover:bg-active-tab">
              <IoArrowUndo />
              <span className="ml-2">Undo Action</span>
            </button>
            <SelectSongModal
              items={assignSongsList}
              isCheckBoxes={true}
              btnText={"Add"}
              title={"Select songs"}
              openModal={selectSongModal}
              closeModal={() => {
                setSelectSongModal(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default page;
