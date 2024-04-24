"use client";

import React, { useEffect, useRef } from "react";
import { GenericButton, InputField } from "..";
import { useForm } from "react-hook-form";
import { Select, Option } from "@mui/base";
import { useAddUpdateSongMutation } from "@/app/_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";

const AddEditSong = ({ openModal, closeModal, fetchList, currentInfo }) => {
  const [addUpdateSongAPI, addUpdateSongResponse] = useAddUpdateSongMutation();
  const { title, artist, introSec, songDuration, category, _id } =
    currentInfo || {};
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      songTitle: currentInfo ? title : "",
      artist: currentInfo ? artist : "",
      introSec: currentInfo ? introSec : "",
      duration: currentInfo ? songDuration : "",
      category: currentInfo ? category : "Standard",
    },
  });
  const reff = useRef();

  useEffect(() => {
    if (openModal) {
      reff.current?.showModal();
    } else {
      reff.current?.close();
    }
  }, [openModal]);

  const onSubmit = async (data) => {
    const payload = {
      title: data.songTitle,
      artist: data.artist,
      introSec: data.introSec,
      songDuration: data.duration,
      category: data.category,
      qualifiedPlayer: true,
      id: currentInfo ? _id : null,
    };
    let response = await addUpdateSongAPI({ data: payload });
    if (response && !response.isError) {
      closeModal();
      toast.success(response.data.description);
      fetchList();
    }
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
              {currentInfo ? `Edit Song` : `Add New Song`}
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
              title="Title"
              placeholder="Enter Title of Song"
              register={register}
              name="songTitle"
              error={errors.songTitle}
              validate={{ required: true }}
            />
            <InputField
              title="Artist"
              placeholder="Enter Artist of Song"
              register={register}
              name="artist"
              error={errors.artist}
              validate={{ required: true }}
            />
            <InputField
              title="Intro Sec"
              placeholder="Enter Intro sec i.e 30"
              register={register}
              name="introSec"
              error={errors.introSec}
              validate={{
                required: "Intro sec is required",
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Please enter only numbers.",
                },
              }}
            />
            <div className="flex flex-col flex-grow mx-1">
              <label htmlFor="">{"Song Duration"}</label>
              <input className=" border-gray-400 border-2 my-1 p-2 rounded" />
            </div>
            <InputField
              title="Song Duration"
              placeholder="Enter Duration in sec i.e 120"
              register={register}
              name="duration"
              error={errors.duration}
              validate={{
                required: "Duration is required",
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Please enter only numbers.",
                },
              }}
            />

            <div className="flex flex-col flex-grow mx-1 w-full">
              <label>Category</label>
              <select
                name="category"
                {...register("category", {
                  required: "Please select category of song",
                })}
                className="select  border-gray-400 border-2 my-1 p-2 rounded focus:outline-none "
              >
                <option>Standard</option>
                <option>Balled</option>
                <option>Comedy</option>
              </select>
            </div>
          </div>

          <div className=" mt-2">
            <GenericButton
              onClick={handleSubmit(onSubmit)}
              text={currentInfo ? "Update" : "Add"}
            />
          </div>
        </div>
      </dialog>
    </>
  );
};

export default AddEditSong;
