<<<<<<< HEAD
"use client";
import React from "react";
import { OptionButton, SongIcon } from "../../_components";
import AddEditPlayer from "@/app/_components/add-edit-player";

const Players = () => {
  const users = [
=======
import { OptionButton } from "../../_components";
import AddEditPlayer from "@/app/_components/add-edit-player";

const Players = async () => {
  let playersList;
  const result = await fetch(
    "http://localhost:3000/api/players/getAllPlayers",
>>>>>>> 5044cec1231e456028fdfc8cfad5b89c0ff0c954
    {
      cache: "no-store",
    }
  );

  if (result.ok) {
    const {
      response: { content },
    } = await result.json();

    playersList = content;
  }
  return (
    <div>
      <div className="overflow-x-auto">
        <div className="flex border-3 justify-end">
          {/* <button
            onClick={() => document?.getElementById("my_modal_3")?.showModal()}
            className=" self-end btn btn-primary bg-primary border-none text-white "
          >
            Add New Player+
          </button> */}
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
                  <SongIcon count={11} />
                </td>
                <td>{<OptionButton item={item} index={index} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {<AddEditPlayer />}
<<<<<<< HEAD
    </>
=======
    </div>
>>>>>>> 5044cec1231e456028fdfc8cfad5b89c0ff0c954
  );
};

export default Players;
