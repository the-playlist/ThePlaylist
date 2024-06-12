import React from "react";

const ViewMode = ({ onLightModePress, isLight, title, onDarkModePress }) => {
  return (
    <div className="w-full  bg-white drop-shadow rounded-lg px-4 py-8 ">
      <div className="flex justify-between items-center ">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className=" w-1/5 bg-gray-300 flex items-center rounded-full relative">
          <button
            onClick={onLightModePress}
            className="w-1/2 py-3 text-center   rounded-full"
          >
            Light
          </button>
          <button
            onClick={onDarkModePress}
            className="w-1/2 py-3  text-black  text-center rounded-full"
          >
            Dark
          </button>
          <div
            className={` absolute text-center rounded-full w-1/2 py-3 drop-shadow  transform transition-transform duration-300  ${
              isLight
                ? " bg-white text-black"
                : " translate-x-full bg-black text-white "
            } `}
          >
            {isLight ? "Light" : "Dark"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMode;
