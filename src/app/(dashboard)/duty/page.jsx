"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaQuestion } from "react-icons/fa";
import {
  useLazyGetStaffListQuery,
  useUpdateDutyStatusMutation,
  useLazyGetAssignSongsWithPlayersQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { MdClear } from "react-icons/md";
import { toast } from "react-toastify";
import {
  CustomLoader,
  GenericButton,
  SelectSongModal,
} from "@/app/_components";
import _ from "lodash";
import { useRouter } from "next/navigation";

const DutyScreen = () => {
  const [getStaffListApi, getStaffListResponse] = useLazyGetStaffListQuery();
  const [getAssignSongsApi, getAssignSongsResponse] =
    useLazyGetAssignSongsWithPlayersQuery();

  const [showModal, setShowModal] = useState(false);
  const popUpRef = useRef(null);
  const [staffList, setStaffList] = useState([]);
  const [assignSongsList, setAssignSongsList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectSongModal, setSelectSongModal] = useState(false);
  const [updateStatusAPI] = useUpdateDutyStatusMutation();

  const router = useRouter();

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
  const countTrueDuty = _.countBy(staffList, "duty.status")[true] || 0;

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      let response = await getStaffListApi(null);
      if (response && !response.isError) {
        let data = response?.data?.content;

        setStaffList(data);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  const fetchAssignSongsList = async () => {
    try {
      let response = await getAssignSongsApi(null);
      if (response && !response.isError) {
        let data = response?.data?.content;
        setAssignSongsList(data);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const onUpdateStatusHandler = async (payload) => {
    let response = await updateStatusAPI(payload);
    if (response && !response.error) {
      toast(response?.data?.description);
      await fetchAssignSongsList();
      staffList.some((player) => {
        if (player.duty.status === true) {
          setSelectSongModal(true);
        }
      });
    } else {
      toast.error(response?.data?.description || "Something Went Wrong...");
    }
  };

  const changeStatus = (id) => {
    setStaffList((prevStaffList) =>
      prevStaffList.map((player) =>
        player._id === id
          ? { ...player, duty: { ...player.duty, status: !player.duty.status } }
          : player
      )
    );
  };
  return (
    <div className="">
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
                    {`Are you sure you want to mark selected players on duty?`}
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
                      let payload = [];
                      staffList?.forEach((item) => {
                        payload.push({
                          id: item?._id,
                          status: item?.duty.status,
                        });
                      });

                      onUpdateStatusHandler(payload);
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
                  On Duty Players ({countTrueDuty})
                </h2>
                <div className="relative w-1/4 mb-8 flex items-center ">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onBlur={() => {
                      setSearchTerm(searchTerm.trim());
                    }}
                    onChange={handleSearch}
                    className="block w-full py-3 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                  />
                  <svg
                    className="absolute top-0 left-0 w-6 h-6 mt-3 ml-3 text-gray-400"
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
              <div className=" overflow-y-auto pb-12 h-[800px] ">
                <table className="table border-separate  border-spacing-y-5  pb-20 px-2">
                  <thead>
                    <tr className="text-base font-medium text-black">
                      <th className="font-medium">Players</th>
                      <td>Status</td>
                      <td className=" float-right ">Change Status</td>
                    </tr>
                  </thead>
                  {filteredPlayers?.map((item, index) => {
                    return (
                      <tbody className="  bg-white drop-shadow rounded-2xl h-20 ">
                        <tr className="">
                          <td className="rounded-s-2xl capitalize">{`${item?.firstName} ${item?.lastName}`}</td>
                          <td>
                            <div className="flex items-center">
                              <div
                                className={`h-2 w-2 rounded-full mr-2 ${
                                  item?.duty.status
                                    ? "bg-green-700"
                                    : "bg-gray-400"
                                }`}
                              ></div>
                              {item?.duty.status ? "on Duty" : "Off Duty"}
                            </div>
                          </td>

                          <td className="rounded-e-2xl ">
                            <div className="flex justify-end">
                              <input
                                onClick={() => {
                                  changeStatus(item?._id);
                                }}
                                type="checkbox"
                                className="toggle toggle-success mr-2 "
                                checked={item.duty.status}
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
              </div>
              {filteredPlayers?.length == 0 && (
                <div className="flex justify-center text-base items-center h-56 text-black w-full">
                  No Players Found
                </div>
              )}
              <div className="sticky bottom-0 w-full flex justify-end py-4 bg-[#fafafa]">
                <GenericButton
                  text="Save Attendance"
                  onClick={() => {
                    setShowModal(true);
                  }}
                />
              </div>
              {selectSongModal && (
                <SelectSongModal
                  items={assignSongsList}
                  btnText={"Push to Queue"}
                  title={"Push to Queue"}
                  openModal={selectSongModal}
                  fetchList={() => {
                    router.push("/playlist");
                  }}
                  closeModal={() => {
                    setSelectSongModal(false);
                  }}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DutyScreen;
