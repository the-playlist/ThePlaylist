"use client";

import React, { useEffect, useRef } from "react";
import { GenericButton, InputField, MinuteSecField } from "..";
import { useForm } from "react-hook-form";
import { Select, Option } from "@mui/base";
import { useAddUpdateSongMutation } from "@/app/_utils/redux/slice/emptySplitApi";
import { toast } from "react-toastify";

const AddEditSong = ({ openModal, closeModal, fetchList, currentInfo }) => {
  const [addUpdateSongAPI, addUpdateSongResponse] = useAddUpdateSongMutation();
  const { title, artist, introSec, songDuration, category, _id } =
    currentInfo || {};
  let minutes, seconds;
  if (currentInfo) {
    const [min, sec] = songDuration?.split(":");

    minutes = min;
    seconds = sec;
  }

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

      category: currentInfo ? category : "Standard",
      minutes: currentInfo ? minutes : "",
      seconds: currentInfo ? seconds : "00",
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
      title: data.songTitle.trim(),
      artist: data.artist.trim(),
      introSec: data.introSec,
      songDuration: `${data.minutes}:${data.seconds}`,
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

  const validateNoStartEndSpace = (value) => {
    const regex = /^\s+|\s+$/; // Matches leading or trailing spaces
    return (
      !regex.test(value) || "Spaces are not allowed at the beginning or end"
    );
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
            <button onClick={closeModal} className="">
              ✕
            </button>
          </form>
          <div className=" flex flex-row justify-evenly flex-wrap mt-2 ">
            <InputField
              title="Title *"
              placeholder="Enter Title of Song"
              register={register}
              name="songTitle"
              error={errors.songTitle}
              validate={{
                required: "Song title is required",
                pattern: {
                  value: /^\S/,
                  message: "White spaces are not allowed",
                },
              }}
            />

            <InputField
              title="Artist *"
              placeholder="Enter Artist of Song"
              register={register}
              name="artist"
              error={errors.artist}
              validate={{
                required: "Song artist is required",
                pattern: {
                  value: /^\S/,
                  message: "White spaces are not allowed",
                },
              }}
            />
          </div>

          <div className="flex ">
            <div className="flex w-1/2 ">
              <div className="w-1/2 flex flex-col flex-grow mx-1 ">
                <label htmlFor="">{"Song Duration *"}</label>
                <div className="flex">
                  <div className=" border-[#D9D9D9] border-[1px] my-1 p-2 rounded-lg pt-0  mr-1 ">
                    <label htmlFor="" className="text-[10px]">
                      {"Min"}
                    </label>
                    <input
                      type="number"
                      placeholder="00"
                      className="focus:outline-none placeholder:text-[#C4C4C4] placeholder:font-normal  w-full "
                      {...register("minutes", {
                        required: "Song Duration is required",
                        min: {
                          value: 0,
                          message: "Minutes duration cannot be negative",
                        },
                        max: {
                          value: 59,
                          message: "Minutes duration cannot exceed 59 minutes",
                        },
                      })}
                    />
                  </div>

                  <div className=" border-[#D9D9D9] border-[1px] my-1 p-2 rounded-lg pt-0 ml-1  ">
                    <label htmlFor="" className="text-[10px]">
                      {"Sec"}
                    </label>
                    <input
                      type="number"
                      placeholder="00"
                      className="focus:outline-none placeholder:text-[#C4C4C4] placeholder:font-normal  w-full "
                      {...register("seconds", {
                        min: {
                          value: 0,
                          message: "seconds cannot be negative",
                        },
                        max: {
                          value: 59,
                          message: "Maximum  seconds cannot exceed 59 seconds",
                        },
                      })}
                    />
                  </div>
                </div>
                {errors.minutes && (
                  <span className=" text-red-900 text-xs font-medium">
                    {errors.minutes.message}
                  </span>
                )}
                {errors.seconds && (
                  <span className=" text-red-900 text-xs font-medium">
                    {errors.seconds.message}
                  </span>
                )}
              </div>
              <div className="w-1/2 flex flex-col flex-grow mx-1 ">
                <label htmlFor="">{"Intro Seconds "}</label>
                <div className=" border-[#D9D9D9] border-[1px] my-1 p-2 rounded-lg pt-0  ">
                  <label htmlFor="" className="text-[10px]">
                    {"Sec"}
                  </label>
                  <input
                    type="number"
                    placeholder="00"
                    className="focus:outline-none placeholder:text-[#C4C4C4] placeholder:font-normal w-full "
                    {...register("introSec", {
                      required: "Intro Sec is required",
                      min: {
                        value: 1,
                        message: "Intro seconds must be greater than 0",
                      },
                      max: {
                        value: 59,
                        message:
                          "Maximum intro seconds cannot exceed 59 seconds",
                      },
                    })}
                  />
                </div>
                {errors.introSec && (
                  <span className=" text-red-900 text-xs font-medium">
                    {errors.introSec.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex w-1/2">
              <div className="flex flex-col flex-grow mx-1  w-full">
                <label>Category *</label>
                <select
                  name="category"
                  {...register("category", {
                    required: "Please select category of song",
                  })}
                  className="select border-[#D9D9D9] border-[1px] my-1 rounded-
lg focus:outline-none "
                  style={{
                    height: "57px",
                  }}
                >
                  <option>Standard</option>
                  <option>Ballad</option>
                  <option>Comedy</option>
                </select>
              </div>
            </div>
          </div>
          <div className=" mt-2">
            <GenericButton
              loading={addUpdateSongResponse?.isLoading}
              disabled={addUpdateSongResponse?.isLoading}
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
