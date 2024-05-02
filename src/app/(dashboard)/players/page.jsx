"use client";
import {
  ConfirmationModal,
  CustomLoader,
  OptionButton,
  ShowQualifiedList,
  SongIcon,
} from "../../_components";
import AddEditPlayer from "@/app/_components/add-edit-player";
import { AddPlayerButton } from "./add-player-button";
import { useEffect, useState } from "react";
import {
  useDeletePlayerByIdMutation,
  useLazyGetAllPlayersQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";

const Players = () => {
  const [addModalOpens, setAddModalOpens] = useState(false);
  const [deletePlayerModal, setDeletePlayerModal] = useState(false);
  const [currentPlayerInfo, setCurrentPlayerInfo] = useState(null);
  const [deletePlayerAPI, deletePlayerResponse] = useDeletePlayerByIdMutation();
  const [playersList, setPlayersList] = useState([]);
  const [getAllPlayersApi, getAllPlayersResponse] = useLazyGetAllPlayersQuery();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async (second) => {
    try {
      const result = await getAllPlayersApi();
      if (result && !result.isError) {
        setPlayersList(result?.data?.content);
      } else {
        // Handle unsuccessful response
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  const onPlayerDeleteHandler = async () => {
    let response = await deletePlayerAPI(currentPlayerInfo._id);
    if (response && !response.error) {
      toast(response?.data?.description);
      fetchPlayers();
    } else {
      toast.error(response?.data?.description || "Something Went Wrong...");
    }
  };

  return (
    <div>
      {getAllPlayersResponse?.isFetching ? (
        <div className=" h-full flex items-center justify-center  bg-white">
          <CustomLoader />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex border-3 justify-end">
            <AddPlayerButton
              onClick={() => {
                setCurrentPlayerInfo(null);
                setAddModalOpens(true);
              }}
            />
          </div>
          <div className=" max-h-[80vh] overflow-y-auto">
            <table className="table border-separate border-spacing-y-5 rounded-2xl px-1 ">
              <thead>
                <tr className="text-black text-lg font-thin">
                  <th></th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Songs</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {playersList?.map((item, index) => (
                  <tr className="h-20 text-black text-lg  bg-white drop-shadow rounded-2xl ">
                    <th className="rounded-l-2xl">{index + 1}</th>
                    <td>{item?.firstName}</td>
                    <td>{item?.lastName}</td>
                    <td>{item?.email}</td>
                    <td>{`+1${item?.phone}`}</td>
                    <td>
                      <SongIcon
                        onClick={() => {
                          setCurrentPlayerInfo(item);
                          document?.getElementById("my_modal_5")?.showModal();
                        }}
                        count={item?.assignSongs?.length}
                      />
                    </td>
                    <td className="rounded-r-2xl">
                      <OptionButton
                        item={item}
                        index={index}
                        onEditPeess={() => {
                          setCurrentPlayerInfo(item);
                          setAddModalOpens(true);
                        }}
                        onDeletePress={() => {
                          setCurrentPlayerInfo(item);
                          setDeletePlayerModal(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {addModalOpens && (
        <AddEditPlayer
          currentInfo={currentPlayerInfo}
          openModal={addModalOpens}
          fetchPlayerList={fetchPlayers}
          closeModal={() => {
            setAddModalOpens(false);
          }}
        />
      )}
      {deletePlayerModal && (
        <ConfirmationModal
          title={"Are you Sure to delete this Player"}
          closeModal={() => {
            setDeletePlayerModal(false);
          }}
          openModal={deletePlayerModal}
          onYesPress={onPlayerDeleteHandler}
        />
      )}
      <ShowQualifiedList
        title={"Songs"}
        currentInfo={currentPlayerInfo?.assignSongs}
      />
    </div>
  );
};

export default Players;
