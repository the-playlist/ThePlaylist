"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdClear } from "react-icons/md";
import _ from "lodash";
import { useAddSongsToPlaylistMutation } from "@/app/_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";
const SelectSongModal = ({ title, openModal, closeModal, btnText, items }) => {
  const reff = useRef();
  const [status, setStatus] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [playersList, setPlayersList] = useState([]);
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
  const [addSongToPlaylistApi, AddSongsToPlaylistResponse] =
    useAddSongsToPlaylistMutation();

  useEffect(() => {
    const tempArr = addSelectedPlayers(items);
    setPlayersList(tempArr);
  }, []);

  function addSelectedPlayers(data) {
    return data.map((item) => {
      const selectedPlayer =
        item.assignedPlayers && item.assignedPlayers.length > 0
          ? item.assignedPlayers[0]
          : {};
      return {
        ...item,
        selectedPlayers: selectedPlayer,
        isChecked: true,
      };
    });
  }

  function generateObjectByPlayerId(record, playerId) {
    const assignedPlayer = record.assignedPlayers.find(
      (player) => player._id == playerId
    );
    if (!assignedPlayer) {
      return null;
    }
    return {
      _id: assignedPlayer._id,
      playerName: assignedPlayer.playerName,
    };
  }
  const addSongsHandler = async (data) => {
    try {
      let response = await addSongToPlaylistApi(data);
      if (response && !response.error) {
        closeModal();
        toast.success(response?.data?.description);
      }
    } catch (error) {
      toast.success(error?.message || "Something went wrong.");
    }
  };
  const getDesiredOuptut = (records) => {
    debugger;
    const transformedRecords = records.map((record, index) => {
      return {
        title: record.title,
        artist: record.artist,
        introSec: record.introSec,
        songDuration: record.songDuration,
        category: record.category,
        playerName: record?.selectedPlayers?.playerName,
        upVote: record.upVote,
        downVote: record.downVote,
        isFav: record.isFav,
        isDeleted: false,
        sortOrder: index,
      };
    });

    addSongsHandler(transformedRecords);
    return transformedRecords;
  };
  useEffect(() => {
    const allStatus = playersList.every((player) => player.isChecked === true);
    if (allStatus) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [playersList]);

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

          <div className=" text-base font-medium text-black text-center flex mt-10 mb-5  px-5 ">
            <div className="w-3/12 ">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  onClick={() => {
                    setPlayersList((prevPlayerList) =>
                      prevPlayerList.map((player) => ({
                        ...player,
                        isChecked: status ? false : true,
                      }))
                    );
                    setStatus(!status);
                  }}
                  defaultChecked={false}
                  checked={playersList.every(
                    (player) => player.isChecked === true
                  )}
                  className="checkbox mr-3 checkbox-success"
                />
                Title
              </div>
            </div>
            <div className="w-3/12">Player</div>
            <div className="w-3/12">Category</div>
            <div className="w-3/12">Intro Seconds</div>
          </div>
          <div className="overflow-y-auto">
            {playersList?.map((item, index) => {
              const matchesSearch =
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item?.assignedPlayers[0]?.playerName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) &&
                  item.assignedPlayers.length > 0);
              if (matchesSearch) {
                return (
                  <div className="text-base bg-white  font-medium text-black  items-center flex  mb-2  p-5 rounded-lg ">
                    <div className="w-3/12 text-center ">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          onClick={() => {
                            setPlayersList((prevPlayerList) =>
                              prevPlayerList.map((player) => {
                                if (player?._id === item?._id) {
                                  return {
                                    ...player,
                                    isChecked: !player.isChecked,
                                  };
                                }
                                return player;
                              })
                            );
                          }}
                          checked={item.isChecked}
                          className="checkbox mr-3 checkbox-success"
                        />

                        {item?.title}
                      </div>
                    </div>
                    <div className="w-3/12 text-center">
                      {item?.assignedPlayers?.length > 1 ? (
                        <select
                          onChange={(e) => {
                            item.selectedPlayers = generateObjectByPlayerId(
                              item,
                              e.target.value
                            );
                          }}
                          className="select select-bordered w-full max-w-xs"
                        >
                          {item?.assignedPlayers?.map((item) => {
                            return (
                              <option
                                value={item?._id}
                              >{`${item.playerName}`}</option>
                            );
                          })}
                        </select>
                      ) : (
                        <div>{`${item?.assignedPlayers[0].playerName}`}</div>
                      )}
                    </div>
                    <div className="w-3/12">
                      <div className="flex items-center justify-center">
                        <div className=" px-7 py-2 rounded-3xl bg-[#F7F7F7]">
                          {item.category}
                        </div>
                      </div>
                    </div>
                    <div className="w-3/12 text-center">{item.introSec}</div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
          <div className="sticky -bottom-5 w-full flex justify-end pb-4 bg-[#fafafa]">
            <button
              onClick={() => {
                const selectedPlayers = playersList.filter(
                  (item) => item.isChecked == true
                );

                getDesiredOuptut(selectedPlayers);
              }}
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
