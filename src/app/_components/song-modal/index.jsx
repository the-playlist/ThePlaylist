import React from 'react'
import GenericButton from '../generic-button'

const SongModal = ({title,item}) => {
  return (
    <dialog id="song_modal" className="modal">
    <div className="modal-box  w-11/12 max-w-2xl">
      <form
        method="dialog"
        className="flex  items-center justify-between flex-1 "
      >
        <div className=" font-bold text-lg mb-3 ">{title}</div>
        {/* if there is a button in form, it will close the modal */}
        <button className="btn btn-sm btn-circle btn-ghost  absolute top-1 right-1">
          ✕
        </button>
      </form>
      <div className=" flex flex-col justify-evenly max-h-60 overflow-y-auto border p-1 rounded">
        {item.map((i) => (
          <div
            className={`cursor-pointer border-b py-1 border-gray-500 flex items-center justify-between px-2 `}
          >
            <span className={`font-semibold text-black `}>{i?.title}</span>
            <span>{i?.artist} </span>
          </div>
        ))}
      </div>

      <div className=" mt-2">
        <form method='dialog'>
        <GenericButton text="OK" />
        </form>
        
      </div>
    </div>
  </dialog>
  )
}

export default SongModal



