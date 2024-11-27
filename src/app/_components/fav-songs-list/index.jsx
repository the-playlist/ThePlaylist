"use client";

import { useLazyGetFavSongListQuery } from "@/app/_utils/redux/slice/emptySplitApi";
import React, { useEffect, useState } from "react";
import SongIcon from "../song-icon";
import ShowQualifiedList from "../qualified";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";

const FavSongList = () => {
  const [getAllFavSongsListApi, getAllSongsListRes] =
    useLazyGetFavSongListQuery();
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );
  const [favSongsList, setFavSongsList] = useState([]);
  const [currentSongInfo, setCurrentSongInfo] = useState(null);

  useEffect(() => {
    fetchFavSongsList();
  }, []);

  const fetchFavSongsList = async () => {
    let response = await getAllFavSongsListApi();
    if (response && !response.isError) {
      setFavSongsList(response.data?.content);
    }
  };

  return (
    <div>
      {favSongsList?.length > 0 ? (
        <div className=" max-h-[80vh] overflow-y-auto">
          <table className="table border-separate border-spacing-y-5 p-1	rounded-2xl ">
            <thead
              className={`${masterViewTheme ? "text-black bg-[#FAFAFA] " : "text-white bg-dark"} sticky top-0 z-10 `}
            >
              <tr className=" text-lg font-thin">
                <th></th>
                <th>Title</th>
                <th>Artist</th>
                <th className=" text-center">Qualified</th>
                <th className=" text-center">Intro Sec</th>
                <th className=" text-center">Category</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {favSongsList?.map((item, index) => (
                <tr
                  key={index}
                  className={`h-20 text-black text-lg ${masterViewTheme ? "bg-white text-black" : "bg-light-tile text-white"} shadow rounded-2xl `}
                >
                  <th className="rounded-l-2xl">{index + 1}</th>
                  <td>{item?.title}</td>
                  <td>{item?.artist}</td>
                  <td className=" text-center flex justify-center  items-center h-20">
                    <SongIcon
                      onClick={() => {
                        if (item?.qualifiedPlayers?.length > 0) {
                          setCurrentSongInfo(item);
                          document?.getElementById("my_modal_5")?.showModal();
                        }
                      }}
                      isUser
                      count={item?.qualifiedCount}
                    />
                  </td>
                  <td className=" text-center">{`:${
                    item?.introSec || "N/A"
                  }`}</td>
                  <td className=" text-center">
                    <span className="text-center font-semibold bg-option p-2 rounded-lg text-black">
                      {item?.category || "N/A"}
                    </span>
                  </td>
                  <td className="rounded-r-2xl">
                    {item.isFav ? (
                      <FaHeart className="text-primary cursor-pointer" />
                    ) : (
                      <FaRegHeart className="cursor-pointer" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[90vh] text-black font-semibold text-lg">
          No Songs found
        </div>
      )}
      <ShowQualifiedList
        title={"Qualified Players"}
        isUser
        currentInfo={currentSongInfo?.qualifiedPlayers}
      />
    </div>
  );
};

export default FavSongList;
