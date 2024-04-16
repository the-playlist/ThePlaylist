"use client";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { GenericButton, InputField } from "..";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";

const songs_ = [
  "Hey Jude",
  "Bohemian Rhapsody",
  "Hotel California",
  "Imagine",
  "Stairway to Heaven",
  "Yesterday",
  "Like a Rolling Stone",
  "Let It Be",
  "Smells Like Teen Spirit",
  "Purple Haze",
];

function AddEditPlayer({ show, handleClose, size }) {
  const [selectedSongsList, setSelectedSongsList] = useState([]);
  const [songs, setSongs] = useState(songs_);
  const [filteredsongs, setFilteredsongs] = useState(songs);
  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box  w-11/12 max-w-2xl">
          <form
            method="dialog"
            className="flex  items-center justify-between flex-1 "
          >
            <div className=" font-bold text-lg ">Add New Player</div>
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost  absolute top-1 right-1">
              ✕
            </button>
          </form>
          <div className=" flex flex-row justify-evenly flex-wrap ">
            <InputField title="First Name" />
            <InputField title="Last Name" />
            <InputField title="Email" />
            <InputField title="Phone" />
          </div>
          <div className="flex flex-wrap">
            {selectedSongsList.map((i, index) => {
              return (
                <div
                  onClick={() => {
                    setSelectedSongsList((prevList) =>
                      prevList.filter((song) => song !== i)
                    );
                  }}
                  className=" cursor-pointer border border-gray-500 flex flex-row items-center m-1 p-1 rounded-lg"
                >
                  <span>{i}</span>
                  <IoMdCloseCircle />
                </div>
              );
            })}
          </div>

          <div className="border rounded mt-2 p-1">
            <div className="font-semibold text-lg ">{`Assign Songs (4)`}</div>
            <div className="flex  flex-row items-center border-2 border-gray-300 shadow-2xl bg-white m-2 p-2 rounded">
              <IoSearchOutline />
              <input
                className="ml-2 outline-none "
                placeholder="Search Songs"
                onChange={(e) => {
                  debugger;
                  let selection = songs.filter((song) =>
                    song.toLowerCase().startsWith(e.target.value.toLowerCase())
                  );
                  setFilteredsongs(selection);
                  debugger;
                }}
              />
            </div>
            <div className="border-3 border-red overflow-y-auto  max-h-36">
              {filteredsongs.map((i) => {
                return (
                  <div
                    onClick={() => {
                      if (!selectedSongsList.includes(i)) {
                        setSelectedSongsList((prevList) => [...prevList, i]);
                      }
                    }}
                    className=" cursor-pointer border-b py-1 border-gray-500 flex items-center justify-between px-2"
                  >
                    <span className="  font-semibold text-black">{i}</span>
                    <span>The Beatles </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className=" mt-2">
            <GenericButton text="Add" />
          </div>
        </div>
      </dialog>
    </>
  );
}

export default AddEditPlayer;
