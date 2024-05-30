"use client";
import React, { useEffect, useRef } from "react";
import { FaQuestion } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import { Loader } from "../loader";

const ConfirmationPopup = ({
  openModal,
  closeModal,
  title,
  onYesPress,
  isDelete,
  isLoading,
}) => {
  const reff = useRef();
  useEffect(() => {
    if (openModal) {
      reff.current?.showModal();
    } else {
      reff.current?.close();
    }
  }, [openModal]);
  return (
    <dialog ref={reff} onClose={closeModal} className="modal ">
      <div className="modal-box  pt-10 rounded-md">
        <form method="dialog">
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <div className="flex items-center mt-2 mb-5">
          <div className=" h-20 w-20 mr-3 rounded-md bg-gray-100 flex items-center justify-center">
            {isDelete ? (
              <BsTrash size={30} color="#FE0101" />
            ) : (
              <FaQuestion size={30} color="#EFC440" />
            )}
          </div>
          <div>
            <h3
              className={`font-bold text-lg ${
                isDelete ? "text-[#FE0101]" : "text-top-queue-bg"
              }`}
            >
              Are you sure?
            </h3>
            <p className=" text-gray-400 text-sm">{title}</p>
          </div>
        </div>

        <div className="">
          <form method="dialog" className="w-full flex  justify-between">
            <button className="btn w-[49%] bg-white text-black border border-black ">
              No, cancel
            </button>

            <button
              onClick={onYesPress}
              disabled={isLoading}
              className="btn w-[49%] bg-primary text-black "
            >
              {isLoading ? <Loader /> : "Yes, confirm"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmationPopup;
