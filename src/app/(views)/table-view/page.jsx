"use client";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "@/app/svgs";
import { FaVideo } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown, IoIosCloseCircle } from "react-icons/io";
import Webcam from "react-webcam";
import Link from "next/link";
import { useLazyGetSongsFromPlaylistQuery } from "@/app/_utils/redux/slice/emptySplitApi";
import { CustomLoader } from "@/app/_components";

const TableView = () => {
  const [getPlaylistSongListApi, getPlaylistSongListResponse] =
    useLazyGetSongsFromPlaylistQuery();
  const [showCam, setShowCam] = useState(false);
  const [fontSize, setFontSize] = useState("text-sm");
  const [performer, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1076) {
        setFontSize("text-lg");
      } else {
        setFontSize("text-sm");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    fetchPlaylistSongList();
  }, []);

  const fetchPlaylistSongList = async () => {
    try {
      let response = await getPlaylistSongListApi(null);
      if (response && !response.isError) {
        setPerformers(response?.data?.content?.list);
      }
      setLoading(false);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const ButtonsAtEnd = ({ onCamPress }) => {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-white flex justify-end p-4">
        <Link
          href={"/add-song"}
          className="flex text-base w-full items-center bg-top-queue-bg hover:bg-yellow-500 hover:text-black text-black font-bold py-3 px-4 rounded-md justify-center"
        >
          <div className="rounded-full bg-add-bg mr-2 p-1">
            <IoAdd size={16} />
          </div>
          Add a Song
        </Link>
        <button
          onClick={onCamPress}
          className="ml-4 w-full text-base flex items-center bg-white border border-black  text-black font-bold py-3 px-4 rounded-md justify-center hover:bg-active-tab"
        >
          <FaVideo size={16} className="mr-2" /> Live Video
        </button>
      </div>
    );
  };

  const ActionButtons = ({ index, item }) => {
    const toggleButton = (isTrue) => {
      let updatedPerformer = [...performer];

      // Create a copy of the performer object at the specified index
      let updatedItem = { ...updatedPerformer[index] };

      // Modify the isVote property of the copied performer object
      updatedItem.isVote = isTrue;

      // Update the performer array with the modified performer object
      updatedPerformer[index] = updatedItem;

      // Update the state with the updated performer array
      setPerformers(updatedPerformer);
    };

    return (
      <div className="flex mr-5">
        <button
          onClick={() => toggleButton(true)}
          className={`flex items-center justify-center rounded-full shadow-xl w-7 h-7  ${
            item?.isVote == true ? "bg-green-500" : "bg-white"
          }`}
        >
          <IoIosArrowUp
            size={18}
            color={`${item?.isVote == true ? "white" : "black"}`}
          />
        </button>
        <button
          onClick={() => toggleButton(false)}
          className={`flex items-center justify-center rounded-full shadow-xl w-7 h-7  ${
            item?.isVote == false ? "bg-red-500" : "bg-white"
          } ml-2`}
        >
          <IoIosArrowDown
            size={18}
            color={`${item?.isVote == false ? "white" : "black"}`}
          />
        </button>
      </div>
    );
  };
  return (
    <div className="overflow-x-auto bg-white h-screen overflow-y-scroll mx-auto  px-5 pt-5">
      {loading ? (
        <CustomLoader />
      ) : (
        <>
          <div className=" flex items-center justify-center m-5">
            <Logo />
          </div>
          {performer.length === 0 && (
            <div className="flex items-center justify-center flex-1 min-h-[50%] font-semibold text-lg">
              The playlist is empty.{" "}
            </div>
          )}
          {showCam ? (
            <>
              <button
                className="flex items-center justify-center"
                onClick={() => {
                  setShowCam(false);
                }}
              >
                <IoIosCloseCircle size={30} /> Close
              </button>
              <Webcam />
            </>
          ) : (
            <div className="mb-30">
              {performer?.map((item, index) => {
                return (
                  <div
                    className={`flex  ${
                      index < 2 ? "bg-top-queue-bg" : ""
                    } rounded-md flex-wrap my-2`}
                  >
                    <div className="w-1/2  text-start flex items-center">
                      {index < 2 ? (
                        <p className="mx-5 font-extrabold text-lg  ">{`${
                          index < 2 ? index + 1 : ""
                        }`}</p>
                      ) : (
                        <ActionButtons key={index} index={index} item={item} />
                      )}
                      <p className={`font-semibold capitalize  ${fontSize}`}>
                        {item?.title}
                      </p>
                    </div>
                    <div
                      className={`w-1/2 p-4 text-end capitalize ${fontSize}`}
                    >
                      {item?.artist}
                    </div>
                  </div>
                );
              })}
              <ButtonsAtEnd
                onCamPress={() => {
                  setShowCam(true);
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TableView;
