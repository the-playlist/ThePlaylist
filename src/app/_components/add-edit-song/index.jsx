import React from "react";
import { GenericButton, InputField } from "..";

const AddEditSong = () => {
  return (
    <>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box  w-11/12 max-w-2xl">
          <form
            method="dialog"
            className="flex  items-center justify-between flex-1 "
          >
            <div className=" font-bold text-lg ">Add New Song</div>
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost  absolute top-1 right-1">
              ✕
            </button>
          </form>
          <div className=" flex flex-row justify-evenly flex-wrap ">
            <InputField title="Title" />
            <InputField title="Artist" />
            <InputField title="Intro Sec" />
            <InputField title="Song Duration" />
          </div>

          <div className=" mt-2">
            <GenericButton text="Add" />
          </div>
        </div>
      </dialog>
    </>
  );
};

export default AddEditSong;
