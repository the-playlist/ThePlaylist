"use client";
import { OptionButton, SongIcon } from "../../_components";
import AddEditPlayer from "@/app/_components/add-edit-player";
import { AddPlayerButton } from "./add-player-button";
import { useEffect, useState } from "react";

const Players = () => {
  const [addModalOpens, setAddModalOpens] = useState(false);
  const [playersList, setPlayersList] = useState([]);
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async (second) => {
    try {
      const result = await fetch(
        `${process.env.DEPLOYMENT_URL}api/players/getAllPlayers`,
        {
          cache: "no-store",
        }
      );
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

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="flex border-3 justify-end">
          <AddPlayerButton onClick={() => setAddModalOpens(true)} />
        </div>
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
                <td>{<OptionButton item={item} index={index} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {addModalOpens && (
        <AddEditPlayer
          openModal={addModalOpens}
          closeModal={() => {
            setAddModalOpens(false);
          }}
        />
      )}
    </div>
  );
};

export default Players;
