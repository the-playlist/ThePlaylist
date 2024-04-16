"use client";
import React from "react";
import { OptionButton, SongIcon } from "../../_components";
import AddEditPlayer from "@/app/_components/add-edit-player";

const Players = () => {
  const users = [
    {
      id: 0,
      firstName: "John Lennon",
      lastName: "Lennon",
      email: "johnLennon@gmail.com",
      phone: "+1 1234 456 789",
    },
    {
      id: 1,
      firstName: "Aretha",
      lastName: "Franklin",
      email: "johnLennon@gmail.com",
      phone: "+1 1122 333 456",
    },
    {
      id: 2,
      firstName: "Michael",
      lastName: "Jackson",
      email: "johnLennon@gmail.com",
      phone: "+1 3344 567 899",
    },
    {
      id: 3,
      firstName: "Van",
      lastName: "Morrison",
      email: "johnLennon@gmail.com",
      phone: "+1 4445 678 990",
    },
  ];
  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex border-3 justify-end">
          <button
            onClick={() => document?.getElementById("my_modal_3")?.showModal()}
            className=" self-end btn btn-primary bg-primary border-none text-white "
          >
            Add New Player+
          </button>
        </div>
        <table className="table border-separate border-spacing-y-5 p-1	rounded-2xl ">
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
            {users?.map((item, index) => (
              <tr className="h-20 text-black text-lg shadow-xl  rounded-2xl ">
                <th>{index + 1}</th>
                <td>{item?.firstName}</td>
                <td>{item?.lastName}</td>
                <td>{item?.email}</td>
                <td>{item?.phone}</td>
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
    </>
  );
};

export default Players;
