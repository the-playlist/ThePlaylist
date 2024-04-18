"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaQuestion } from "react-icons/fa";
import { useLazyGetStaffListQuery } from "@/app/_utils/redux/slice/emptySplitApi";
import CircularProgress from "@mui/joy/CircularProgress";

interface Staff {
  firstName: String;
  lastname: String;
  _id: String;
  duty: {
    startTime: null;
    endTime: null;
    status: Boolean;
  };
}
const DutyScreen = () => {
  const [getStaffListApi, getStaffListResponse] = useLazyGetStaffListQuery();
  const [showModal, setShowModal] = useState(false);
  const popUpRef = useRef<HTMLDialogElement>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checked, setIsChecked] = useState(false);

  useEffect(() => {
    if (showModal) {
      popUpRef?.current?.showModal();
    } else {
      popUpRef?.current?.close();
    }
  }, [showModal]);

  const toggleButton = (isTrue: boolean, index: any) => {
    setStaffList((prevStaffList: Staff[]) => {
      const updatedStaff: Staff[] = [...prevStaffList];
      const updatedDuty = { ...updatedStaff[index].duty, status: isTrue };
      updatedStaff[index] = { ...updatedStaff[index], duty: updatedDuty };
      return updatedStaff;
    });
  };

  const toggleAllPlayersStatus = () => {
    setStaffList((prevStaffList: any) => {
      if (checked) {
        return prevStaffList.map((staff: any) => ({
          ...staff,
          duty: { ...staff.duty, status: false },
        }));
      } else {
        return prevStaffList.map((staff: any) => ({
          ...staff,
          duty: { ...staff.duty, status: true },
        }));
      }
    });
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlayers = staffList.filter(
    (player: any) =>
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

  return (
    <div className="overflow-x-auto">
      {getStaffListResponse?.isFetching ? (
        <div className="flex items-center justify-center">
          <CircularProgress color="warning" variant="outlined" />
        </div>
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
                      toggleAllPlayersStatus();
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

          {filteredPlayers?.length > 0 && (
            <>
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
                  {searchTerm?.length > 0 && (
                    <button onClick={() => setSearchTerm("")} className=" w-32">
                      <span>Clear all</span>
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
                    <td className=" float-right ">
                      <div className="flex">
                        <input
                          onClick={() => setShowModal(true)}
                          type="checkbox"
                          defaultChecked={false}
                          checked={
                            filteredPlayers.every(
                              (player: any) => player.duty.status === true
                            ) || false
                          }
                          className="checkbox mr-2 checkbox-success"
                        />
                        <span>
                          Mark all as {!checked ? "on Duty" : "Off Duty"}
                        </span>
                      </div>
                    </td>
                  </tr>
                </thead>
                {filteredPlayers?.map((item: any, index) => (
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
                            onClick={() =>
                              toggleButton(!item.duty.status, index)
                            }
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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DutyScreen;
