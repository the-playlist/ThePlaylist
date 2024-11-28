import React from "react";
import { useSelector } from "react-redux";

function InputField({
  title,
  error,
  register,
  name,
  validate,
  isPhone,
  isLight,
  ...props
}: {
  title: string;
  error: any;
  register: any;
  name: string;
  validate: any;
  isPhone: boolean;
  isLight?: boolean;
}) {
  return (
    <div className="flex flex-col flex-grow mx-1 ">
      <label className={isLight ? " text-black" : "text-white"}>{title}</label>
      <div
        className={` border-[1px] my-1 px-2 py-3 rounded-lg   ${isLight ? "bg-white border-[#D9D9D9]" : "border-darkThemeBorder bg-light-tile"} `}
      >
        {isPhone && (
          <span className="bg-gray-2 text-gray-3 rounded p-1 mr-1 ">+1</span>
        )}
        <input
          className={`focus:outline-none placeholder:text-[#C4C4C4] placeholder:font-normal ${isLight ? "bg-white  text-black" : " bg-light-tile text-white"}`}
          {...register(name, validate)}
          {...props}
        />
      </div>
      {error && (
        <span className=" text-red-900 text-xs font-medium">
          {error?.message || "Error"}
        </span>
      )}
    </div>
  );
}

export default InputField;
