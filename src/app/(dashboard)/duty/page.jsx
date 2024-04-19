"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaQuestion } from "react-icons/fa";
import {
  useLazyGetStaffListQuery,
  useUpdateDutyStatusMutation,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { MdClear } from "react-icons/md";
import { toast } from "react-toastify";
import { CustomLoader } from "@/app/_components";

const DutyScreen = () => {
  const [getStaffListApi, getStaffListResponse] = useLazyGetStaffListQuery();
  const [showModal, setShowModal] = useState(false);
  const popUpRef = useRef(null);
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checked, setIsChecked] = useState(false);
  const [updateStatusAPI, updateStatusResponse] = useUpdateDutyStatusMutation();

  useEffect(() => {
    if (showModal) {
      popUpRef?.current?.showModal();
    } else {
      popUpRef?.current?.close();
    }
  }, [showModal]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlayers = staffList.filter(
    (player) =>
      player?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      let response = await getStaffListApi(null);
      if (response && !response.isError) {
        setStaffList(response?.data?.content);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const onUpdateStatusHandler = async (id, status) => {
    let payload = {
      id: id,
      status: status,
    };

    let response = await updateStatusAPI(payload);
    if (response && !response.error) {
      toast(response?.data?.description);
      fetchStaffList();
    } else {
      toast.error(response?.data?.description || "Something Went Wrong...");
    }
  };

  return (
    <div className="overflow-x-auto">
      {getStaffListResponse?.isFetching ? (
        <CustomLoader />
      ) : (
        <>
          <dialog ref={popUpRef} className="modal ">
            <div className="modal-box  pt-10 rounded-md">
              <button
                onClick={() => {
                  setShowModal(false);
                }}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
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
                <div className="w-full flex  justify-between">
                  <button
                    className="btn w-[49%] bg-white text-black border border-black"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    No, cancel
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStatusHandler(
                        null,
                        filteredPlayers.every(
                          (player) => player.duty.status === true
                        )
                          ? false
                          : true
                      );
                      setIsChecked(checked ? false : true);
                      setShowModal(false);
                    }}
                    className="btn w-[49%] bg-black text-white "
                  >
                    Yes, confirm
                  </button>
                </div>
              </div>
            </div>
          </dialog>
          {staffList?.length > 0 && (
            <>
              <div className="px-2">
                <h2 className="font-medium my-5">
                  On Duty Players ({filteredPlayers?.length})
                </h2>
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
                  {searchTerm?.length > 0 && (
                    <button
                      className="absolute right-0 top-4 hover:pointer rounded-r-lg px-4 py-2 "
                      onClick={() => setSearchTerm("")}
                    >
                      <MdClear size={20} className="text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
              <table className="table border-separate border-spacing-y-5 px-2">
                <thead>
                  <tr className="text-base font-medium text-black">
                    <th className="font-medium">Players</th>
                    <td>Status</td>
                    <td>Shift start time</td>
                    <td>Shift End time</td>
                    {filteredPlayers?.length > 0 && (
                      <td className=" float-right ">
                        <div className="flex">
                          <input
                            onClick={() => setShowModal(true)}
                            type="checkbox"
                            defaultChecked={false}
                            checked={
                              filteredPlayers.every(
                                (player) => player.duty.status === true
                              ) || false
                            }
                            className="checkbox mr-2 checkbox-success"
                          />
                          <span>
                            Mark all as {!checked ? "on Duty" : "Off Duty"}
                          </span>
                        </div>
                      </td>
                    )}
                  </tr>
                </thead>
                {filteredPlayers?.map((item, index) => (
                  <tbody className="  shadow-lg rounded-2xl h-20 ">
                    <tr className="">
                      <td className="rounded-s-2xl capitalize">{`${item?.firstName} ${item?.lastName}`}</td>
                      <td>
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${
                              item?.duty.status ? "bg-green-700" : "bg-gray-400"
                            }`}
                          ></div>
                          {item?.duty.status ? "on Duty" : "Off Duty"}
                        </div>
                      </td>
                      <td>N/A</td>
                      <td>N/A</td>
                      <td className="rounded-e-2xl ">
                        <div className="flex justify-end">
                          <input
                            onClick={() => {
                              onUpdateStatusHandler(
                                item._id,
                                !item.duty.status
                              );
                            }}
                            type="checkbox"
                            className="toggle toggle-success mr-2 "
                            checked={item.duty.status}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
              {filteredPlayers?.length == 0 && (
                <div className="flex justify-center text-base items-center h-56 text-black w-full">
                  No Players Found
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DutyScreen;
