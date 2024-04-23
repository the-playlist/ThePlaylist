"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdClear } from "react-icons/md";

const SelectSongModal = ({
  title,
  openModal,
  closeModal,
  btnText,
  isCheckBoxes,
}) => {
  const reff = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (openModal) {
      reff.current?.showModal();
    } else {
      reff.current?.close();
    }
  }, [openModal]);

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
  const filteredResult = dummyArray.filter(
    (player) =>
      player?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player?.playerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <dialog ref={reff} onClose={closeModal} className="modal">
        <div className="modal-box  w-1/2 max-w-4xl p-4 bg-[#fafafafa]">
          <div className="flex justify-between items-center">
            <div>{title}</div>
            <button onClick={closeModal}>
              <MdClear size={20} />
            </button>
          </div>
          {isCheckBoxes && (
            <div className="relative w-1/3 my-4 flex items-center ">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onBlur={() => {
                  setSearchTerm(searchTerm.trim());
                }}
                onChange={handleSearch}
                className="block w-full py-5 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <svg
                className="absolute top-0 left-0 w-6 h-6 mt-5 ml-3 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M20 20l-4.172-4.172M12 18a6 6 0 100-12 6 6 0 000 12z" />
              </svg>
              {searchTerm?.length > 0 && (
                <button
                  className="absolute right-0 top-4 hover:pointer rounded-r-lg px-4 py-2 "
                  onClick={() => setSearchTerm("")}
                >
                  <MdClear size={20} className="text-gray-400" />
                </button>
              )}
            </div>
          )}
          <div className=" text-base font-medium text-black text-center flex mt-10 mb-5  px-5 ">
            <div className="w-3/12 ">
              <div className="flex items-center">
                {isCheckBoxes && (
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    //   checked={
                    //     filteredPlayers.every(
                    //       (player) => player.duty.status === true
                    //     ) || false
                    //   }
                    className="checkbox mr-3 checkbox-success"
                  />
                )}
                Title
              </div>
            </div>
            <div className="w-3/12">Player</div>
            <div className="w-3/12">Category</div>
            <div className="w-3/12">Intro Seconds</div>
          </div>
          <div className="overflow-y-auto">
            {filteredResult.map((item, index) => {
              return (
                <div className="text-base bg-white  font-medium text-black text-center flex  mb-2  p-5 rounded-lg ">
                  <div className="w-3/12 ">
                    <div className="flex items-center">
                      {isCheckBoxes && (
                        <input
                          type="checkbox"
                          defaultChecked={false}
                          //   checked={
                          //     filteredPlayers.every(
                          //       (player) => player.duty.status === true
                          //     ) || false
                          //   }
                          className="checkbox mr-3 checkbox-success"
                        />
                      )}
                      {item?.title}
                    </div>
                  </div>
                  <div className="w-3/12">
                    <select className="select select-bordered w-full max-w-xs">
                      <option disabled selected>
                        Normal
                      </option>
                      <option>Normal Apple</option>
                      <option>Normal Orange</option>
                      <option>Normal Tomato</option>
                    </select>
                  </div>
                  <div className="w-3/12">
                    <div className="flex items-center justify-center">
                      <div className=" px-7 py-2 rounded-3xl bg-[#F7F7F7]">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <div className="w-3/12">{item.intro}</div>
                </div>
              );
            })}
          </div>
          <div className="sticky -bottom-5 w-full flex justify-end pb-4 bg-[#fafafa]">
            <button
              onClick={closeModal}
              className="flex text-base w-full items-center bg-top-queue-bg hover:bg-yellow-500 hover:text-black text-white font-bold py-3 px-4 rounded-md justify-center"
            >
              {btnText}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default SelectSongModal;
