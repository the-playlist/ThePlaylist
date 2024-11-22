"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdClear } from "react-icons/md";
import _ from "lodash";
import {
  useAddSongsToPlaylistMutation,
  useAddSongsToPlaylistV2Mutation,
  useLazyGetAssignSongsWithPlayersQuery,
  useLazyGetAssignSongsWithPlayersV2Query,
  useLazyGetLimitByTitleQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import GenericButton from "../generic-button";
import { Loader } from "../loader";
import { useDispatch } from "react-redux";
import { setInitialSongPlaylist } from "@/app/_utils/redux/slice/playlist-list";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

const AssignedSongsDropdown = ({ item }) => {
  const [selectedId, setSelectedId] = useState(item?.selectedPlayers?._id);
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

  return (
    <select
      value={selectedId}
      onChange={(e) => {
        e.preventDefault();
        const value = generateObjectByPlayerId(item, e.target.value);
        setSelectedId(value._id);
        item.selectedPlayers = value;
      }}
      className="select select-bordered w-full max-w-xs focus:outline-none"
    >
      {item?.assignedPlayers?.map((item) => {
        return <option value={item?._id}>{`${item.playerName}`}</option>;
      })}
    </select>
  );
};

const SelectSongModal = ({
  isPlaylist,
  item,
  title,
  openModal,
  closeModal,
  btnText,
  fetchList,
  isDuty,
  onReload,
}) => {
  const pathname = usePathname();

  const currentSongSecond = useSelector(
    (state) => state?.playlistReducer?.currentSongSecond
  );
  const storedSeconds = parseInt(currentSongSecond);
  const playlistLength = useSelector(
    (state) => state?.playlistReducer?.playlistLength
  );

  const [getLimitByTitleApi] = useLazyGetLimitByTitleQuery();
  const [getAssignSongsApi] = useLazyGetAssignSongsWithPlayersQuery();
  const [getAssignSongsV2Api] = useLazyGetAssignSongsWithPlayersV2Query();

  const [songLimit, setSongLimit] = useState(0);
  const [socket, setSocket] = useState();
  const reff = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [playersList, setPlayersList] = useState([]);
  const [playlistCount, setPlaylistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  const dispatch = useDispatch();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
    });
    socket.connect();
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (openModal) {
      reff.current?.showModal();
    } else {
      reff.current?.close();
    }
  }, [openModal]);

  const [addSongToPlaylistV2Api] = useAddSongsToPlaylistV2Mutation();
  const [addSongToPlaylistApi] = useAddSongsToPlaylistMutation();

  useEffect(() => {
    getLimitByTitleHandler();
    fetchAssignSongsList();
  }, [songLimit, playlistLength]);

  function countUniquePlayers(songs) {
    const uniquePlayerIds = new Set();

    songs.forEach((song) => {
      song?.assignedPlayers.forEach((player) => {
        uniquePlayerIds.add(player._id);
      });
    });

    return uniquePlayerIds.size;
  }

  function canPlayerBeSelected(playerCheckCount, playerId, maxOccurance) {
    return (
      playerCheckCount[playerId] === undefined ||
      playerCheckCount[playerId] < maxOccurance
    );
  }

  function randomlyCheckItems(data, numberOfChecks, maxOccurance) {
    const checkedItems = [];
    const playerCheckCount = {};

    const checksToMake = Math.min(numberOfChecks, data.length);

    // Shuffle data array to ensure random order
    const shuffledData = data.sort(() => 0.5 - Math.random());

    for (let item of shuffledData) {
      // Stop if we've checked enough items
      if (checkedItems.length >= checksToMake) break;

      const playerId = item.selectedPlayers?._id;

      if (
        playerId &&
        canPlayerBeSelected(playerCheckCount, playerId, maxOccurance) &&
        !checkedItems.includes(item)
      ) {
        // Mark the item as checked and add it to the checked items array
        checkedItems.push(item);

        // Increment the check count for the player
        playerCheckCount[playerId] = (playerCheckCount[playerId] || 0) + 1;

        // Mark the item as checked
        item.isChecked = true;
      }
    }
    let index = 0;
    while (checkedItems.length < checksToMake) {
      const item = shuffledData[index % shuffledData.length];

      if (!checkedItems.includes(item)) {
        checkedItems.push(item);
        item.isChecked = true;
      }
      index++;
    }

    return data;
  }

  const fetchAssignSongsList = async () => {
    try {
      setIsLoading(true);
      let response = await getAssignSongsV2Api(null);

      if (response && !response.isError) {
        const { list, playlistCount } = response?.data?.content;
        const getOccurrence = songLimit / countUniquePlayers(list);
        const roundedNumber = Math.ceil(getOccurrence);

        setPlaylistCount(playlistCount);
        let tempArr = addSelectedPlayers(list);

        if (isDuty) {
          tempArr = randomlyCheckItems(tempArr, songLimit, roundedNumber);
        }
        setPlayersList(tempArr);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Fetch failed:", error);
    }
  };

  const getLimitByTitleHandler = async () => {
    let response = await getLimitByTitleApi("Queue Limit");
    if (response && !response.isError) {
      const { value } = response?.data?.content;
      setSongLimit(value || 0);
    }
  };

  const getRandomId = (length) => {
    return Math.floor(Math.random() * length);
  };

  let assignedPlayers = [];
  const getRandomSelectedPlayer = (playersList) => {
    let randomIndex = getRandomId(playersList?.length);
    const playerId = playersList[randomIndex]._id;
    let occurance = assignedPlayers.filter((item) => item === playerId)?.length;

    if (occurance > 2) {
      randomIndex = getRandomId(playersList?.length);
    }
    const selectedPlayer = playersList[randomIndex];
    assignedPlayers.push(playerId);

    return selectedPlayer;
  };

  function addSelectedPlayers(data) {
    return data?.map((item, index) => {
      const selectedPlayer =
        item.assignedPlayers && item.assignedPlayers?.length > 0
          ? getRandomSelectedPlayer(item.assignedPlayers)
          : {};
      return {
        ...item,
        selectedPlayers: selectedPlayer,
      };
    });
  }
  const addSongsHandler = async (data) => {
    try {
      let response = await addSongToPlaylistV2Api(data);

      if (response && !response.error) {
        const { isFirstTimeFetched, playlist } = response?.data?.content;
        localStorage.setItem("isFirstTimeFetched", isFirstTimeFetched);
        closeModal();
        toast.success(response?.data?.description);
        onReload();
        setTimeout(() => {
          fetchList(isFirstTimeFetched);
        }, 1000);

        setBtnLoader(false);
      }
    } catch (error) {
      toast.success(error?.message || "Something went wrong.");
    }
  };
  const getDesiredOuptut = (records) => {
    setBtnLoader(true);
    const transformedRecords = records.map((record, index) => {
      return {
        songData: record?._id,
        assignedPlayer: record?.selectedPlayers?._id,
        sortOrder: playlistCount + index,
        qualifiedPlayers: record?.assignedPlayers,
      };
    });

    addSongsHandler(transformedRecords);

    return transformedRecords;
  };

  const activeSongsCount = playersList?.filter((item) => item.isChecked).length;

  return (
    <>
      <dialog ref={reff} onClose={closeModal} className="modal">
        <div className="modal-box  w-1/2 max-w-4xl min-h-1.5 pb-4  p-0 bg-[#fafafafa]">
          {isLoading ? (
            <div className=" h-96 flex items-center justify-center pt-4  ">
              <Loader />
            </div>
          ) : (
            <>
              <div className="sticky z-10 bg-[#fafafafa] lg:p-4 px-4 py-2 top-0">
                <div className="flex justify-between items-center">
                  <div>{`${title} (${activeSongsCount}) `}</div>
                  <button onClick={closeModal}>
                    <MdClear size={20} />
                  </button>
                </div>
                {playersList?.length > 0 && (
                  <div className="relative w-1/3 my-4 flex items-center ">
                    <input
                      type="text"
                      placeholder="Search by Title/PlayerName"
                      value={searchTerm}
                      onBlur={() => {
                        setSearchTerm(searchTerm.trim());
                      }}
                      onChange={handleSearch}
                      className="block w-full py-5 pl-10 pr-4 border placeholder:text-base border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
                    <div className="flex items-center">Title</div>
                  </div>
                  <div className="w-3/12">Player</div>
                  <div className="w-3/12">Category</div>
                  <div className="w-3/12">Location</div>
                </div>
              </div>

              <div className="overflow-y-auto px-4">
                {playersList?.filter((item) => {
                  return (
                    item.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    (item?.assignedPlayers[0]?.playerName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) &&
                      item.assignedPlayers?.length > 0)
                  );
                }).length === 0 ? (
                  <div className="text-center text-black h-52 flex items-center justify-center ">
                    No records found
                  </div>
                ) : (
                  playersList?.map((item, index) => {
                    const matchesSearch =
                      item.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      (item?.assignedPlayers[0]?.playerName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                        item.assignedPlayers?.length > 0);
                    const trimmedTitle =
                      item?.title?.length > 15
                        ? `${item?.title?.slice(0, 12)}...`
                        : item?.title;

                    if (matchesSearch) {
                      return (
                        <div
                          key={index}
                          className="text-base bg-white font-medium text-black items-center flex mb-2 p-5 rounded-lg"
                        >
                          <div className="w-3/12 text-center">
                            <div className="flex items-start">
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
                              <div className="text-start">
                                {item?.title?.length > 12 ? (
                                  <div className="group relative flex justify-center">
                                    {trimmedTitle}
                                    <span className="absolute top-8 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                                      {item?.title}
                                    </span>
                                  </div>
                                ) : (
                                  item?.title
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="w-3/12 text-center">
                            {item?.assignedPlayers?.length > 1 ? (
                              <AssignedSongsDropdown item={item} />
                            ) : (
                              <div>{`${item?.assignedPlayers[0].playerName}`}</div>
                            )}
                          </div>
                          <div className="w-3/12">
                            <div className="flex items-center justify-center">
                              <div className="px-7 py-2 rounded-3xl bg-[#F7F7F7]">
                                {item.category}
                              </div>
                            </div>
                          </div>
                          <div className="w-3/12 ">
                            <div className="flex items-center justify-center">
                              <div className="px-7 py-2 rounded-3xl bg-[#F7F7F7]">
                                {item.location || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })
                )}
              </div>

              <div className="sticky -bottom-5 w-full   px-4 pb-4  bg-[#fafafa]">
                <GenericButton
                  disabled={btnLoader || activeSongsCount == 0}
                  loading={btnLoader}
                  text={playersList?.length == 0 ? "Duty Screen" : btnText}
                  onClick={() => {
                    if (playersList?.length == 0) {
                      closeModal();
                    } else {
                      const selectedPlayers = playersList.filter(
                        (item) => item.isChecked == true
                      );
                      getDesiredOuptut(selectedPlayers);
                      if (playlistLength < 1) {
                        dispatch(setInitialSongPlaylist(true));
                      }
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  );
};

export default SelectSongModal;
