"use client";
import React, { useState } from "react";
import { FaQuestion } from "react-icons/fa";

const DutyScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState([
    {
      id: 0,
      name: "John Lennon",
      status: true,
      startTime: "09:00 AM",
      endTime: "05:00 PM",
    },
    {
      id: 1,
      name: "Aretha Franklin",
      status: false,
      startTime: "09:00 AM",
      endTime: "05:00 PM",
    },
    {
      id: 2,
      name: "Aretha Franklin",
      status: false,
      startTime: "09:00 AM",
      endTime: "05:00 PM",
    },
    {
      id: 3,
      name: "Aretha Franklin",
      status: false,
      startTime: "09:00 AM",
      endTime: "05:00 PM",
    },
  ]);
  const [checked, setIsChecked] = useState(false);
  const toggleButton = (isTrue: boolean, index: any) => {
    setPlayers((prePlayers) => {
      const updatedPlayers = [...prePlayers];
      updatedPlayers[index].status = isTrue;
      return updatedPlayers;
    });
  };

  const toggleAllPlayersStatus = () => {
    setPlayers((prevPlayers) => {
      if (checked) {
        return prevPlayers.map((player) => {
          return { ...player, status: false };
        });
      } else {
        return prevPlayers.map((player) => {
          return { ...player, status: true };
        });
      }
    });
  };
  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="overflow-x-auto">
      <dialog id="my_modal_3" className="modal ">
        <div className="modal-box  pt-10 rounded-md">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex items-center mt-2 mb-5">
            <div className=" h-20 w-20 mr-3 rounded-md bg-gray-100 flex items-center justify-center">
              <FaQuestion size={30} color="#EFC440" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-top-queue-bg">
                Are you sure?
              </h3>
              <p className=" text-gray-400 text-sm">
                {`Are you sure you want to mark all players as ${
                  !checked ? `"on Duty"` : `"Off Duty"`
                }?`}
              </p>
            </div>
          </div>

          <div className="">
            <form method="dialog" className="w-full flex  justify-between">
              <button className="btn w-[49%] bg-white text-black border border-black ">
                No, cancel
              </button>

              <button
                onClick={() => {
                  toggleAllPlayersStatus();
                  setIsChecked(checked ? false : true);
                }}
                className="btn w-[49%] bg-black text-white "
              >
                Yes, confirm
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action "></div>
        </div>
      </dialog>
      <div className="px-2">
        <h2 className="font-medium my-5">On Duty Players (5)</h2>
        <div className="relative w-1/4 mb-8 flex items-center ">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
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
          <button className=" w-32">
            <span>Clear all</span>
          </button>
        </div>
      </div>
      <table className="table border-separate border-spacing-y-5 px-2">
        <thead>
          <tr className="text-base font-medium text-black">
            <th className="font-medium">Players</th>
            <td>Status</td>
            <td>Shift start time</td>
            <td>Shift End time</td>
            <td className=" float-right ">
              <div className="flex">
                <input
                  onClick={() =>
                    document?.getElementById("my_modal_3")?.showModal()
                  }
                  type="checkbox"
                  checked={checked}
                  className="checkbox mr-2 checkbox-success"
                />
                <span>Mark all as {!checked ? "on Duty" : "Off Duty"}</span>
              </div>
            </td>
          </tr>
        </thead>
        {filteredPlayers?.map((item, index) => (
          <tbody className="  shadow-lg rounded-2xl h-20 ">
            <tr className="">
              <td className="rounded-s-2xl">{item.name}</td>
              <td>
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      item?.status ? "bg-green-700" : "bg-gray-400"
                    }`}
                  ></div>
                  {item?.status ? "on Duty" : "Off Duty"}
                </div>
              </td>
              <td>Quality Control Specialist</td>
              <td>Littel, Schaden and Vandervort</td>
              <td className="rounded-e-2xl ">
                <div className="flex justify-end">
                  <input
                    onClick={() => toggleButton(!item.status, index)}
                    type="checkbox"
                    className="toggle toggle-success mr-2 "
                    checked={item.status}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default DutyScreen;
