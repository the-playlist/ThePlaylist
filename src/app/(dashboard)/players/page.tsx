"use client";
import React, { useState } from "react";
import { OptionButton } from "../../_components";
import AddEditPlayer from "@/app/_components/add-edit-player";

const Players = () => {
  const [addEditEmplyee, setAddEditEmplyee] = useState(false);
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
            onClick={() => document.getElementById("my_modal_3").showModal()}
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
            {users?.map((item: any, index: number) => (
              <tr className="h-20 text-black text-lg shadow-xl  rounded-2xl ">
                <th>{index + 1}</th>
                <td>{item?.firstName}</td>
                <td>{item?.lastName}</td>
                <td>{item?.email}</td>
                <td>{item?.phone}</td>
                <td>
                  <div className="w-15 h-15">
                    <div className="bg-yellow-600 w-10 h-10  rounded-full flex  items-center justify-center ">
                      <svg
                        width="11"
                        height="18"
                        viewBox="0 0 11 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.2498 10.4108C10.2498 10.4108 10.2032 10.5269 9.59041 12.0108C9.56808 12.0646 9.53448 12.1138 9.49154 12.1556C9.44859 12.1974 9.39715 12.231 9.34013 12.2545C9.28312 12.2779 9.22166 12.2908 9.15926 12.2923C9.09686 12.2939 9.03474 12.2841 8.97645 12.2634C8.91816 12.2428 8.86484 12.2118 8.81954 12.1722C8.77423 12.1325 8.73783 12.0851 8.71241 12.0324C8.68698 11.9798 8.67304 11.9231 8.67137 11.8655C8.6697 11.8079 8.68034 11.7506 8.70267 11.6968C9.31081 10.228 9.3644 10.0946 9.3644 10.0946C9.94691 8.69893 11.3076 5.43441 7.34892 2.99785C7.09366 2.84484 6.85901 2.66436 6.64991 2.46022V14.9333C6.62585 15.7393 6.26838 16.5061 5.6509 17.0764C5.03343 17.6468 4.20281 17.9772 3.32962 18C2.44655 18 1.59965 17.6762 0.975222 17.0999C0.350798 16.5236 0 15.7419 0 14.9269C0 14.1118 0.350798 13.3302 0.975222 12.7539C1.59965 12.1775 2.44655 11.8538 3.32962 11.8538H5.70625V0H6.66389V0.430108C6.69788 0.801588 6.82557 1.16057 7.03677 1.47836C7.24796 1.79614 7.5368 2.06389 7.88017 2.26022C12.468 5.09462 10.7974 9.09678 10.2498 10.4108Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                </td>
                <td>{<OptionButton item={item} index={index} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {<AddEditPlayer show={addEditEmplyee} />}
    </>
  );
};

export default Players;
