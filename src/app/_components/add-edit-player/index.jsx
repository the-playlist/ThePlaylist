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

function AddEditPlayer({
  openModal,
  closeModal,
  currentInfo,
  fetchPlayerList,
}) {
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
        firstName: data?.fName,
        lastName: data?.lName,
        email: data?.email,
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
        <div className="modal-box  w-11/12 max-w-2xl">
          <form
            method="dialog"
            className="flex  items-center justify-between flex-1 "
          >
            <div className=" font-bold text-lg ">
              {currentInfo ? "Edit Player" : "Add New Player"}
            </div>
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost  absolute top-1 right-1"
            >
              ✕
            </button>
          </form>
          <div className=" flex flex-row justify-evenly flex-wrap ">
            <InputField
              title="First Name"
              placeholder="Enter First Name"
              register={register}
              name="fName"
              error={errors.fName}
              validate={{ required: "First name is required" }}
            />
            <InputField
              placeholder="Enter Last Name"
              validate={{ required: "Last name is required" }}
              title="Last Name"
              register={register}
              name="lName"
              error={errors.lName}
            />
            <InputField
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
              title="Phone"
              register={register}
              name="phone"
              isPhone
              placeholder="Enter Phone"
              onChange={handleNumberChange}
            />
          </div>

          <div className="border rounded mt-2 p-1">
            <div className="font-semibold text-lg ">{`Assign Songs (${selectedSongsList.length})`}</div>
            <div className="flex  flex-row items-center border-2 border-gray-300 shadow-md bg-white m-2 p-2 rounded">
              <IoSearchOutline />
              <input
                className="ml-2 outline-none "
                placeholder="Search Songs"
                onChange={(e) => {
                  let selection = songs.filter((song) =>
                    song.title
                      .toLowerCase()
                      .startsWith(e.target.value.toLowerCase())
                  );
                  setFilteredsongs(selection);
                }}
              />
            </div>
            <div
              className={`flex flex-wrap ${
                selectedSongsList?.length > 0 && "bg-[#F4F4F4] mb-5 mt-3"
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
            <div className="border-3 border-red overflow-y-auto  max-h-36">
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
                    }}
                    className={`cursor-pointer ${
                      index < filteredsongs?.length - 1 && "border-b"
                    } py-1 border-gray-500 flex items-center justify-between px-2 ${
                      !isInclude && `bg-primary rounded-lg my-1`
                    }`}
                  >
                    <span
                      className={`font-semibold text-black ${
                        !isInclude && `text-white`
                      }`}
                    >
                      {i?.title}
                    </span>
                    <span
                      className={` text-black ${!isInclude && `text-white`}`}
                    >
                      {i?.artist}{" "}
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
