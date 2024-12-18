"use client";

import React, { useEffect, useRef, useState } from "react";
import { GenericButton, InputField } from "..";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CircularProgress from "@mui/joy/CircularProgress";
import _ from "lodash";
import {
  useAddUpdatePlayerMutation,
  useLazyGetSongsListQuery,
} from "@/app/_utils/redux/slice/emptySplitApi";
import { MdClear } from "react-icons/md";
import { useSelector } from "react-redux";

function AddEditPlayer({
  openModal,
  closeModal,
  currentInfo,
  fetchPlayerList,
}) {
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );
  const { _id, firstName, lastName, email, phone, assignSongs } =
    currentInfo || {};
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fName: currentInfo ? firstName : "",
      lName: currentInfo ? lastName : "",
      email: currentInfo ? email : "",
      phone: currentInfo ? phone : "",
    },
  });
  const selectedSongsListPrev = _.map(assignSongs, ({ _id, title }) => ({
    _id,
    title,
  }));
  const reff = useRef();
  const [getSongsListApi, getSongsListResponse] = useLazyGetSongsListQuery();
  const [addPlayerApi, addPlayerResponse] = useAddUpdatePlayerMutation();
  const [searchTerm, setSearchTerm] = useState();
  useEffect(() => {
    if (openModal) {
      reff.current?.showModal();
    } else {
      reff.current?.close();
    }
  }, [openModal]);

  const onSubmit = (data) => {
    addPlayerHandler(data);
  };

  const [selectedSongsList, setSelectedSongsList] = useState(
    currentInfo ? selectedSongsListPrev : []
  );
  const [songs, setSongs] = useState([]);
  const [filteredsongs, setFilteredsongs] = useState([]);

  useEffect(() => {
    fetchSongsList();
  }, []);

  const addPlayerHandler = async (data) => {
    try {
      let response = await addPlayerApi({
        firstName: data?.fName.trim(),
        lastName: data?.lName.trim(),
        email: data?.email.trim(),
        phone: data?.phone,
        assignSongs: _.map(selectedSongsList, ({ _id }) => _id),
        id: currentInfo ? _id : null,
      });
      if (response && !response.error) {
        closeModal();
        toast.success(response?.data?.description);
        fetchPlayerList();
      }
    } catch (error) {
      toast.success(error?.message || "Something went wrong.");
    }
  };

  const fetchSongsList = async () => {
    try {
      let response = await getSongsListApi(null);
      if (response && !response.isError) {
        setSongs(response?.data?.content);
        setFilteredsongs(response?.data?.content);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  const handleNumberChange = (e) => {
    const { value } = e.target;
    const cleanedValue = value.replace(/\D/g, ""); // Remove any non-digit characters
    e.target.value = cleanedValue;
  };
  return (
    <>
      <dialog ref={reff} onClose={closeModal} className="modal">
        <div
          className={`modal-box  w-11/12 max-w-2xl ${masterViewTheme ? " bg-light" : "bg-dark"}`}
        >
          <form
            method="dialog"
            className={`flex  items-center justify-between flex-1 ${masterViewTheme ? "text-black" : "text-white"}`}
          >
            <div className={` font-bold text-lg  mb-4 `}>
              {currentInfo ? "Edit Player" : "Add New Player"}
            </div>

            <button
              onClick={closeModal}
              className={`btn btn-sm btn-circle btn-ghost  absolute top-1 right-1 `}
            >
              ✕
            </button>
          </form>
          <div className=" flex flex-row justify-evenly flex-wrap ">
            <InputField
              isLight={masterViewTheme}
              title="First Name"
              placeholder="Enter First Name"
              register={register}
              name="fName"
              error={errors.fName}
              validate={{ required: "First name is required" }}
            />
            <InputField
              isLight={masterViewTheme}
              placeholder="Enter Last Name"
              validate={{ required: "Last name is required" }}
              title="Last Name"
              register={register}
              name="lName"
              error={errors.lName}
            />
            <InputField
              isLight={masterViewTheme}
              placeholder="Enter Email"
              validate={{
                required: "Email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Invalid email format",
                },
              }}
              title="Email"
              register={register}
              name="email"
              error={errors.email}
            />
            <InputField
              isLight={masterViewTheme}
              title="Phone"
              register={register}
              name="phone"
              isPhone
              placeholder="Enter Phone"
              onChange={handleNumberChange}
            />
          </div>
          <div
            className={`font-semibold my-1 text-lg ${masterViewTheme ? " text-black" : " text-white "} `}
          >{`Assign Songs (${selectedSongsList?.length})`}</div>
          <div
            className={`border rounded mt-2 px-3 pt-3 ${masterViewTheme ? "" : " border-darkThemeBorder bg-light-tile"}`}
          >
            <div
              className={`flex  flex-row items-center   shadow-md ${masterViewTheme ? "bg-white border-2" : "bg-dark"} p-2 rounded`}
            >
              <IoSearchOutline
                className={masterViewTheme ? "" : " text-gray-300"}
              />
              <input
                className={`ml-2 outline-none  w-full border-none ${masterViewTheme ? "bg-white  text-black" : " bg-dark text-white"}`}
                placeholder="Search Songs"
                value={searchTerm}
                onChange={(e) => {
                  let selection = songs.filter((song) =>
                    song.title
                      .toLowerCase()
                      .startsWith(e.target.value.toLowerCase())
                  );
                  setSearchTerm(e.target.value.toLowerCase());
                  setFilteredsongs(selection);
                }}
              />
              {searchTerm && (
                <button
                  className="  hover:pointer  rounded-r-lg px-4 py-2 "
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredsongs(songs);
                  }}
                >
                  <MdClear size={20} />
                </button>
              )}
            </div>
            <div
              className={`flex flex-wrap   ${
                selectedSongsList?.length > 0 &&
                `${masterViewTheme ? "bg-light" : " bg-black"} mb-5 mt-3`
              }  rounded-md p-2 max-h-20 overflow-y-auto`}
            >
              {selectedSongsList.map((i, index) => {
                return (
                  <div
                    onClick={() => {
                      setSelectedSongsList((prevList) =>
                        prevList.filter((song) => song.title !== i.title)
                      );
                    }}
                    className=" cursor-pointer  flex flex-row items-center m-1 p-1 rounded-lg bg-primary"
                  >
                    <span className=" text-black font-medium">{i.title}</span>
                    <IoMdCloseCircle className=" text-white  ml-1" />
                  </div>
                );
              })}
            </div>

            {getSongsListResponse?.isFetching && (
              <div className="flex items-center justify-center">
                <CircularProgress color="warning" variant="outlined" />
              </div>
            )}
            <div className="overflow-y-auto  max-h-36">
              {filteredsongs?.map((i, index) => {
                const isInclude = !selectedSongsList.some(
                  (item) => item._id === i._id
                );
                return (
                  <div
                    onClick={() => {
                      if (isInclude) {
                        setSelectedSongsList((prevList) => [...prevList, i]);
                      }
                      setSearchTerm("");
                    }}
                    className={`cursor-pointer ${
                      index < filteredsongs?.length - 1 && "border-b"
                    } py-1 border-gray-500 flex items-center justify-between px-2 ${
                      !isInclude && `bg-primary rounded-lg my-1`
                    }`}
                  >
                    <span
                      className={`font-semibold
                        ${!isInclude && masterViewTheme ? "text-white" : "text-black "}`}
                    >
                      {i?.title}
                    </span>
                    <span
                      className={` text-black  ${!isInclude && masterViewTheme ? "text-white" : "text-black "}`}
                    >
                      {i?.artist}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className=" mt-2">
            <GenericButton
              loading={addPlayerResponse?.isLoading}
              disabled={addPlayerResponse?.isLoading}
              text={currentInfo ? "Update player" : "Add Player"}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}

export default AddEditPlayer;
