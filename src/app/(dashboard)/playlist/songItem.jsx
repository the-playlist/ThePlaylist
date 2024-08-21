import React from "react";
import { FaForward, FaHeart, FaTrashAlt } from "react-icons/fa";
import { RevertMasterIcon } from "@/app/svgs";
import { FaHeart, FaTrashAlt } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { EllipsisText } from "@/app/_components/ellipsis-text";
import { SongCountdownTimer } from "../../_components";
import { useSelector } from "react-redux";
import { DragHandle } from "./dragable";

export function PlaylistSongItem({
  revertCrownhandler,
  deleteSongFromPlaylistHandler,
  socket,
  setShowCountDown,
  playlistSongList,
  item,
  dragHandleProps,
  loading,
  setLoader,
}) {
  const currentSongSecond = useSelector(
    (state) => state?.playlistReducer?.currentSongSecond
  );
  const initialSongPlaylist_ = useSelector(
    (state) => state?.playlistReducer?.initialSongPlaylist
  );
  const initialSongPlaylist = JSON.parse(initialSongPlaylist_);

  const playingState = useSelector(
    (state) => state?.playlistReducer?.playingState
  );
  const {
    title,
    upVote,
    downVote,
    playerName,
    introSec,
    category,
    isFav,
    sortOrder,
    sortByMaster,
    songDuration,
    id: index,
  } = item || {};
  const isLockedSongs = index == 0 || index == 1;
  const { onMouseDown, onTouchStart } = dragHandleProps || {};

  return (
    <div className="disable-select">
      <div
        key={index}
        className={` text-center ${
          isLockedSongs ? "bg-top-queue-bg" : "bg-white"
        }  shadow rounded-2xl h-20 flex items-center  px-5`}
        onClick={(e) => {
          e.preventDefault();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          console.log("touchStart");
          // e.target.style.backgroundColor = "blue";
          document.body.style.overflow = "scroll";
          onTouchStart(e);
        }}
        onMouseDown={(e) => {
          console.log("mouseDown");
          document.body.style.overflow = "scroll";
          onMouseDown(e);
        }}
        onTouchEnd={(e) => {
          // e.target.style.backgroundColor = "black";
          document.body.style.overflow = "scroll";
        }}
        onMouseUp={() => {
          document.body.style.overflow = "scroll";
        }}
      >
        <div className="w-1/12 text-start font-extrabold text-lg disable-select dragHandle">
          <div className=" flex items-center justify-center  cursor-pointer">
            {!isLockedSongs ? (
              sortByMaster ? (
                loading == item?._id ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <button
                    onClick={() => {
                      setLoader(item?._id);
                      revertCrownhandler(item);
                    }}
                  >
                    <RevertMasterIcon />
                  </button>
                )
              ) : (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    console.log("touchStart");
                    e.target.style.backgroundColor = "blue";
                    document.body.style.overflow = "scroll";
                    onTouchStart(e);
                  }}
                  onMouseDown={(e) => {
                    console.log("mouseDown");
                    document.body.style.overflow = "scroll";
                    onMouseDown(e);
                  }}
                  onTouchEnd={(e) => {
                    e.target.style.backgroundColor = "black";
                    document.body.style.overflow = "scroll";
                  }}
                  onMouseUp={() => {
                    document.body.style.overflow = "scroll";
                  }}
                  className="border flex items-center justify-center text-top-queue-bg border-gray-300 rounded-full h-10 w-10 cursor-pointer"
                >
                  <HiOutlineArrowsUpDown />
                </div>
              )
            ) : (
              index + 1
            )}
          </div>
        </div>
        <div className="w-2/12 pr-10">
          <EllipsisText text={title} length={15} />
        </div>
        <div className="w-1/12">
          {!isLockedSongs && (
            <div className="flex items-center justify-center">
              <div className="bg-[#f1f7ee] px-5 mr-2 py-3 flex items-center rounded-3xl">
                <div className="flex items-center justify-center bg-green-500 rounded-full shadow w-6 h-6 mr-2">
                  <IoIosArrowUp size={18} color={"white"} />
                </div>
                {upVote}
              </div>
              <div className="bg-[#FCEDED] px-5 py-3 flex items-center rounded-3xl">
                <div className="flex items-center justify-center bg-red-500 rounded-full shadow w-6 h-6 mr-2">
                  <IoIosArrowDown size={18} color={"white"} />
                </div>
                {downVote}
              </div>
            </div>
          )}
        </div>
        <div className="w-3/12">{playerName}</div>
        <div className="w-2/12 flex items-center justify-center">
          <div className="bg-white shadow flex items-center justify-center mt-2 h-10 w-10 rounded-full">
            {introSec || 0}
          </div>
        </div>
        <div className={`w-2/12 flex items-center justify-center `}>
          <div
            className={` ${
              index > 1 ? "bg-[#F7F7F7]" : "bg-white"
            } rounded-3xl px-5 py-2`}
          >
            {category}
          </div>
        </div>
        <div className="w-1/12">
          <div className="flex items-center justify-end ">
            {index === 0 && (
              <SongCountdownTimer
                socket={socket}
                orignalSongDuration={songDuration}
                setShowCountDown={(value) => {
                  if (initialSongPlaylist) {
                    setShowCountDown(value);
                  }
                }}
                duration={currentSongSecond}
                advanceTheQueue={() => {
                  deleteSongFromPlaylistHandler(playlistSongList[0]?._id);
                }}
                playlistSongList={playlistSongList}
                isStart={playingState}
              />
            )}
            {isFav && (
              <FaHeart
                className={`${isLockedSongs ? "text-white" : "text-primary"}`}
                size={20}
              />
            )}
            {!isLockedSongs && (
              <button
                onClick={() => {
                  deleteSongFromPlaylistHandler(item?._id, true);
                }}
                className=" hover:cursor-pointer ml-5"
              >
                <FaTrashAlt className="text-red-500" size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const PlaylistSongItem_ = ({ item, itemSelected, dragHandleProps }) => {
  const { onMouseDown, onTouchStart } = dragHandleProps;

  return (
    <div
      className="disable-select"
      style={{
        border: "1px solid black",
        margin: "4px",
        padding: "10px",
        display: "flex",
        justifyContent: "space-around",
        background: "#fff",
        userSelect: "none",
      }}
    >
      {item.id}
      <div
        className="disable-select dragHandle"
        style={{
          fontWeight: "600",
          transform: "rotate(90deg)",
          width: "20px",
          height: "20px",
          backgroundColor: "black",
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          console.log("touchStart");
          e.target.style.backgroundColor = "blue";
          document.body.style.overflow = "scroll";
          onTouchStart(e);
        }}
        onMouseDown={(e) => {
          console.log("mouseDown");
          document.body.style.overflow = "scroll";
          onMouseDown(e);
        }}
        onTouchEnd={(e) => {
          e.target.style.backgroundColor = "black";
          document.body.style.overflow = "scroll";
        }}
        onMouseUp={() => {
          document.body.style.overflow = "scroll";
        }}
      ></div>
    </div>
  );
};
