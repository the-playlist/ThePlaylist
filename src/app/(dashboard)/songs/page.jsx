"use client";
import {
  AddEditSong,
  Loader,
  OptionButton,
  ShowQualifiedList,
  SongIcon,
} from "@/app/_components";
import { useLazyGetSongsListQuery } from "@/app/_utils/redux/slice/emptySplitApi";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const SongsManagment = () => {
  const [songsListApi, songsListResponse] = useLazyGetSongsListQuery();
  const [songsList, setSongsList] = useState([]);

  useEffect(() => {
    fetchSongsList();
  }, []);

  const fetchSongsList = async () => {
    let response = await songsListApi();
    if (response && !response.isError) {
      setSongsList(response.data?.content);
    }
  };

  return (
    <>
      <div className="flex border-3 justify-end">
        <button
          onClick={() => document?.getElementById("my_modal_4")?.showModal()}
          className=" self-end btn btn-primary bg-primary border-none text-white "
        >
          Add New Song+
        </button>
      </div>
      <div className=" max-h-[80vh] overflow-y-auto">
        {songsListResponse?.isFetching && <Loader />}
        <table className="table border-separate border-spacing-y-5 p-1	rounded-2xl ">
          <thead>
            <tr className="text-black text-lg font-thin">
              <th></th>
              <th>Title</th>
              <th>Artist</th>
              <th className=" text-center">Qualified</th>
              <th className=" text-center">Intro Sec</th>
              <th className=" text-center">Category</th>
              <th className=" text-center"> Mark as Fav</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {songsList?.map((item, index) => (
              <tr className="h-20 text-black text-lg shadow-xl  rounded-2xl ">
                <th>{index + 1}</th>
                <td>{item?.title}</td>
                <td>{item?.artist}</td>
                <td className=" text-center flex justify-center  items-center h-20">
                  <SongIcon
                    onClick={() =>
                      document?.getElementById("my_modal_5")?.showModal()
                    }
                    isUser
                    count={item.qualifiedCount}
                  />
                </td>
                <td className=" text-center">{`:${item?.introSec}`}</td>
                <td className=" text-center">{item?.category || "N/A"}</td>
                <td className=" text-center flex justify-center  items-center h-20">
                  {item?.isFav ? (
                    <FaHeart className="text-primary" />
                  ) : (
                    <FaRegHeart />
                  )}
                </td>
                <td>{<OptionButton item={item} index={index} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddEditSong />
      <ShowQualifiedList title={"Qualified"} />
    </>
  );
};

export default SongsManagment;
