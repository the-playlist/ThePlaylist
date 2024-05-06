"use client";
import {
  AddEditSong,
  ConfirmationModal,
  CustomLoader,
  Loader,
  OptionButton,
  ShowQualifiedList,
  SongIcon,
} from "../../_components";
import {
  useDeleteSongByIdMutation,
  useLazyGetSongsListQuery,
  useMarkSongFavMutation,
} from "@/app/_utils/redux/slice/emptySplitApi";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const SongsManagment = () => {
  const [songsListApi, songsListResponse] = useLazyGetSongsListQuery();
  const [deleteSongModal, setDeleteSongModal] = useState(false);
  const [addNewSongModal, setAddNewSongModal] = useState(false);
  const [deleteSongAPI, deleteSongResponse] = useDeleteSongByIdMutation();
  const [currentSongInfo, setCurrentSongInfo] = useState(null);

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
          <CustomLoader />
        </div>
      ) : (
        <>
          <div className="flex justify-between mt-5 items-center mx-1">
            <div className=" text-xl font-bold text-black">Songs list</div>
            <button
              onClick={() => {
                setCurrentSongInfo(null);
                setAddNewSongModal(true);
              }}
              className=" self-end hover:bg-primary  btn btn-primary bg-primary border-none text-black "
            >
              + Add New Song
            </button>
          </div>
          <div className=" max-h-[80vh] overflow-y-auto">
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
                  <tr className="h-20 text-black text-lg bg-white shadow rounded-2xl ">
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
                      <span className="text-center font-semibold bg-option p-2 rounded-lg">
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
