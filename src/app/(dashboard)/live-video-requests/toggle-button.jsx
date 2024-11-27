import React from "react";
import { useSelector } from "react-redux";

export const Togglebutton = ({
  onLightModePress,
  btnText1,
  onDarkModePress,
  btnText2,
  isLight,
}) => {
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );
  return (
    <div className="flex flex-row items-center ">
      <div
        className={`font-bold ${masterViewTheme ? "text-black" : "text-white"} text-xl mr-2`}
      >
        {" "}
        Change View Mode :{" "}
      </div>
      <div className=" w-1/5 bg-gray-300 flex items-center rounded-full relative">
        <button
          onClick={onLightModePress}
          className="w-1/2 py-3 text-center   rounded-full"
        >
          {btnText1}
        </button>
        <button
          onClick={onDarkModePress}
          className="w-1/2 py-3  text-black  text-center rounded-full"
        >
          {btnText2}
        </button>
        <div
          className={` absolute text-center rounded-full w-1/2 py-3 drop-shadow  transform transition-transform duration-300  ${
            isLight
              ? " bg-primary text-black"
              : " translate-x-full bg-black text-white "
          } `}
        >
          {isLight ? btnText1 : btnText2}
        </div>
      </div>
    </div>
  );
};
