"use client";
import {
  AddEditSong,
  OptionButton,
  ShowQualifiedList,
  SongIcon,
} from "@/app/_components";
import React from "react";

const SongsManagment = () => {
  const songsList = [
    {
      id: 0,
      title: "John Lennon",
      Artist: "Lennon",
      qualifiedCount: 2,
      introSec: 23,
    },
    {
      id: 1,
      title: "Aretha",
      Artist: "Franklin",
      qualifiedCount: 2,
      introSec: 11,
    },
    {
      id: 2,
      title: "Michael",
      Artist: "Jackson",
      qualifiedCount: 2,
      introSec: 42,
    },
    {
      id: 3,
      title: "Van",
      Artist: "Morrison",
      qualifiedCount: 2,
      introSec: 54,
    },
  ];
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
      <table className="table border-separate border-spacing-y-5 p-1	rounded-2xl ">
        <thead>
          <tr className="text-black text-lg font-thin">
            <th></th>
            <th>Title</th>
            <th>Artist</th>
            <th>Qualified</th>
            <th>Intro Sec</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {songsList?.map((item, index) => (
            <tr className="h-20 text-black text-lg shadow-xl  rounded-2xl ">
              <th>{index + 1}</th>
              <td>{item?.title}</td>
              <td>{item?.Artist}</td>
              <td>
                <SongIcon
                  onClick={() =>
                    document?.getElementById("my_modal_5")?.showModal()
                  }
                  isUser
                  count={item.qualifiedCount}
                />
              </td>
              <td>{`:${item?.introSec}`}</td>
              <td>{<OptionButton item={item} index={index} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddEditSong />
      <ShowQualifiedList title={"Qualified"} />
    </>
  );
};

export default SongsManagment;
