"use client";
import {
  AddEditSong,
  ConfirmationModal,
  OptionButton,
  ShowQualifiedList,
  SongIcon,
} from "../../_components";
import {
  useDeleteSongByIdMutation,
  useDisbaleSongFromSongBankMutation,
  useLazyGetSongsListQuery,
  useMarkSongFavMutation,
} from "@/app/_utils/redux/slice/emptySplitApi";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { MdClear } from "react-icons/md";
import { CustomLoader } from "../../_components/custom_loader";
import { useSelector } from "react-redux";

const ToggleButton = ({ isChecked, item }) => {
  const [isEnable, setIsEnable] = useState(isChecked);
  const [disableSongAPI] = useDisbaleSongFromSongBankMutation();

  return (
    <input
      onClick={async () => {
        setIsEnable(!isEnable);
        let response = await disableSongAPI({
          id: item._id,
          status: isEnable,
        });
        if (response && response.data.success) {
          toast.success(response?.data?.description);
        }
      }}
      type="checkbox"
      className="toggle toggle-success mr-2 "
      checked={isEnable}
    />
  );
};

const SongsManagment = () => {
  const [songsListApi, songsListResponse] = useLazyGetSongsListQuery();
  const [deleteSongModal, setDeleteSongModal] = useState(false);
  const [addNewSongModal, setAddNewSongModal] = useState(false);
  const [deleteSongAPI] = useDeleteSongByIdMutation();
  const [currentSongInfo, setCurrentSongInfo] = useState(null);
  const [filteredsongs, setFilteredsongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [songsList, setSongsList] = useState([]);
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );

  useEffect(() => {
    fetchSongsList();
  }, []);

  const fetchSongsList = async () => {
    let response = await songsListApi();
    if (response && !response.isError) {
      setSongsList(response.data?.content);
      setFilteredsongs(response.data?.content);
    }
  };
  const onSongDeleteHandler = async () => {
    let response = await deleteSongAPI(currentSongInfo._id);
    if (response && !response.error) {
      setDeleteSongModal(false);
      toast(response?.data?.description);
      fetchSongsList();
    } else {
      toast.error(response?.data?.description || "Something Went Wrong...");
    }
  };

  return (
    <>
      {songsListResponse?.isFetching ? (
        <div className=" h-full flex items-center justify-center ">
          <CustomLoader bgColor={masterViewTheme ? "bg-dark" : "bg-light"} />
        </div>
      ) : (
        <>
          <div className="flex justify-between mt-5 items-center mx-1">
            <div className=" w-full">
              <div
                className={`text-xl font-bold mb-4 ${masterViewTheme ? "text-black" : "text-white"} `}
              >
                Songs list
              </div>
              <div className="relative w-1/4 mb-8 flex items-center ">
                <input
                  type="text"
                  placeholder="Search song by title"
                  value={searchTerm}
                  onChange={async (e) => {
                    let selection = songsList.filter((song) =>
                      song.title
                        .toLowerCase()
                        .startsWith(e.target.value.toLowerCase())
                    );

                    setSearchTerm(e.target.value.toLowerCase());
                    await setFilteredsongs([]);
                    setFilteredsongs(selection);
                    if (e.target.value.length === 0) {
                      await setFilteredsongs([]);
                      await setSongsList([]);
                      fetchSongsList();
                    }
                  }}
                  className="block w-full py-3 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                />
                <svg
                  className="absolute top-0 left-0 w-6 h-6 mt-3 ml-3 text-gray-400"
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
                    className="absolute right-0 top-2 hover:pointer rounded-r-lg px-4 py-2 "
                    onClick={async () => {
                      setSearchTerm("");
                      setFilteredsongs(songsList);
                      await setFilteredsongs([]);
                      await setSongsList([]);
                      fetchSongsList();
                    }}
                  >
                    <MdClear size={20} className="text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentSongInfo(null);
                setAddNewSongModal(true);
              }}
              className="  hover:bg-primary  btn btn-primary bg-primary border-none text-black "
            >
              + Add New Song
            </button>
          </div>
          {filteredsongs?.length > 0 ? (
            <div className=" max-h-[80vh] pb-10 overflow-y-auto">
              <table className="table border-separate border-spacing-y-5 p-1 	rounded-2xl ">
                <thead
                  className={`sticky top-0 z-10   ${masterViewTheme ? "bg-[#FAFAFA] text-black" : " bg-dark text-white"}`}
                >
                  <tr className="text-lg font-thin">
                    <th></th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th className=" text-center">Online</th>
                    <th className=" text-center">Qualified</th>
                    <th className=" text-center">Location</th>
                    <th className=" text-center">Category</th>
                    <th className=" text-center"> Mark as Fav</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredsongs?.map((item, index) => (
                    <tr
                      className={`h-20 ${masterViewTheme ? "bg-white text-black" : "bg-light-tile text-white"} text-lg  shadow rounded-2xl `}
                    >
                      <th className="rounded-l-2xl">{index + 1}</th>
                      <td>{item?.title}</td>
                      <td>{item?.artist}</td>
                      <td>
                        <ToggleButton
                          item={item}
                          isChecked={!item?.isDisabled}
                        />
                      </td>
                      <td className=" text-center flex justify-center  items-center h-20">
                        <SongIcon
                          onClick={() => {
                            if (item?.qualifiedPlayers?.length > 0) {
                              setCurrentSongInfo(item);
                              document
                                ?.getElementById("my_modal_5")
                                ?.showModal();
                            }
                          }}
                          isUser
                          count={item?.qualifiedCount}
                        />
                      </td>
                      <td className=" text-center">
                        {item?.location || item?.introSec}
                      </td>
                      <td className=" text-center">
                        <span
                          className={`text-center font-semibold bg-option p-2 rounded-lg text-black `}
                        >
                          {item?.category || "N/A"}
                        </span>
                      </td>
                      <td className=" text-center flex justify-center  items-center h-20">
                        <FavIcon id={item._id} isFav_={item.isFav} />
                      </td>
                      <td className="rounded-r-2xl">
                        {
                          <OptionButton
                            item={item}
                            index={index}
                            onEditPeess={() => {
                              setCurrentSongInfo(item);
                              setAddNewSongModal(true);
                            }}
                            onDeletePress={() => {
                              setCurrentSongInfo(item);
                              setDeleteSongModal(true);
                            }}
                          />
                        }
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
          {addNewSongModal && (
            <AddEditSong
              currentInfo={currentSongInfo}
              fetchList={fetchSongsList}
              openModal={addNewSongModal}
              closeModal={() => {
                setAddNewSongModal(false);
              }}
            />
          )}
          {deleteSongModal && (
            <ConfirmationModal
              title={"Are you Sure to delete this Song"}
              closeModal={() => {
                setDeleteSongModal(false);
              }}
              isDelete={true}
              openModal={deleteSongModal}
              onYesPress={onSongDeleteHandler}
            />
          )}
          <ShowQualifiedList
            title={"Qualified Players"}
            isUser
            currentInfo={currentSongInfo?.qualifiedPlayers}
          />
        </>
      )}
    </>
  );
};

const FavIcon = ({ isFav_, id }) => {
  const [isFav, setIsFav] = useState(isFav_);
  const [markSongFavApi] = useMarkSongFavMutation();

  const markSong = async () => {
    let response = await markSongFavApi({ id: id, isFav: !isFav });
    if (response && !response.isError) {
      toast(response?.data?.description);
    }
  };
  return isFav ? (
    <FaHeart
      onClick={() => {
        setIsFav(!isFav);
        markSong();
      }}
      className="text-primary cursor-pointer"
    />
  ) : (
    <FaRegHeart
      onClick={() => {
        setIsFav(!isFav);
        markSong();
      }}
      className="cursor-pointer"
    />
  );
};

export default SongsManagment;
