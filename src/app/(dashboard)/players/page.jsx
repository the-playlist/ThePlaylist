"use client";
import { ConfirmationModal, OptionButton, SongIcon } from "../../_components";
import AddEditPlayer from "@/app/_components/add-edit-player";
import { AddPlayerButton } from "./add-player-button";
import { useEffect, useState } from "react";
import { useDeletePlayerByIdMutation } from "@/app/_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";

const Players = () => {
  const [addModalOpens, setAddModalOpens] = useState(false);
  const [deletePlayerModal, setDeletePlayerModal] = useState(false);
  const [currentPlayerInfo, setCurrentPlayerInfo] = useState(null);
  const [deletePlayerAPI, deletePlayerResponse] = useDeletePlayerByIdMutation();
  const [playersList, setPlayersList] = useState([]);
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async (second) => {
    try {
      const result = await fetch(`/api/players/getAllPlayers`, {
        cache: "no-store",
      });
      if (result.ok) {
        const {
          response: { content },
        } = await result.json();

        setPlayersList(content);
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
      <div className="overflow-x-auto">
        <div className="flex border-3 justify-end">
          <AddPlayerButton onClick={() => setAddModalOpens(true)} />
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
                <tr className="h-20 text-black text-lg shadow-lg  rounded-2xl ">
                  <th>{index + 1}</th>
                  <td>{item?.firstName}</td>
                  <td>{item?.lastName}</td>
                  <td>{item?.email}</td>
                  <td>{`+1${item?.phone}`}</td>
                  <td>
                    <SongIcon count={item?.assignSongs?.length} />
                  </td>
                  <td>
                    <OptionButton
                      item={item}
                      index={index}
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
      {addModalOpens && (
        <AddEditPlayer
          openModal={addModalOpens}
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
    </div>
  );
};

export default Players;
