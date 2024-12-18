"use client";
import {
  ConfirmationModal,
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
import { CustomLoader } from "@/app/_components/custom_loader";
import { useSelector } from "react-redux";

const Players = () => {
  const [addModalOpens, setAddModalOpens] = useState(false);
  const [deletePlayerModal, setDeletePlayerModal] = useState(false);
  const [currentPlayerInfo, setCurrentPlayerInfo] = useState(null);
  const [deletePlayerAPI] = useDeletePlayerByIdMutation();
  const [playersList, setPlayersList] = useState([]);
  const [getAllPlayersApi, getAllPlayersResponse] = useLazyGetAllPlayersQuery();
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async (second) => {
    try {
      const result = await getAllPlayersApi();
      if (result && !result.isError) {
        setPlayersList(result?.data?.content);
      } else {
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
        <div
          className={`h-full flex items-center justify-center ${masterViewTheme ? "bg-white" : " bg-dark"} `}
        >
          <CustomLoader bgColor={masterViewTheme ? "bg-dark" : "bg-light"} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex mt-5 justify-between items-center mx-1">
            <div
              className={`text-xl font-bold ${masterViewTheme ? "text-black" : "text-white"} `}
            >
              Players list
            </div>
            <AddPlayerButton
              onClick={() => {
                setCurrentPlayerInfo(null);
                setAddModalOpens(true);
              }}
            />
          </div>
          {playersList?.length > 0 ? (
            <div className=" max-h-[80vh] overflow-y-auto">
              <table className="table table-auto w-full  border-separate border-spacing-y-5 rounded-2xl px-1 ">
                <thead
                  className={`sticky top-0 z-10 ${masterViewTheme ? "bg-[#FAFAFA] text-black" : " bg-dark text-white"} `}
                >
                  <tr className="text-lg font-thin sticky ">
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
                    <tr
                      className={`h-20  text-lg  ${masterViewTheme ? "bg-white text-black" : "bg-light-tile text-white"}  shadow rounded-2xl `}
                    >
                      <th className="rounded-l-2xl">{index + 1}</th>
                      <td>{item?.firstName}</td>
                      <td>{item?.lastName}</td>
                      <td>{item?.email}</td>
                      <td>{`+1${item?.phone}`}</td>
                      <td>
                        <SongIcon
                          onClick={() => {
                            if (item?.assignSongs?.length > 0) {
                              setCurrentPlayerInfo(item);
                              document
                                ?.getElementById("my_modal_5")
                                ?.showModal();
                            }
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
          ) : (
            <div
              className={`flex items-center justify-center h-[90vh] ${masterViewTheme ? "text-black" : " text-white"}  font-semibold text-lg`}
            >
              No Players found
            </div>
          )}
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
          title={`Are you sure you want to delete ${currentPlayerInfo?.firstName} ${currentPlayerInfo?.lastName} from list? `}
          closeModal={() => {
            setDeletePlayerModal(false);
          }}
          openModal={deletePlayerModal}
          onYesPress={onPlayerDeleteHandler}
          isDelete={true}
        />
      )}
      <ShowQualifiedList
        title={`Songs (${currentPlayerInfo?.firstName} ${currentPlayerInfo?.lastName})`}
        currentInfo={currentPlayerInfo?.assignSongs}
      />
    </div>
  );
};

export default Players;
