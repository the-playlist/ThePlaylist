import React from "react";
import { useSelector } from "react-redux";

function ChangePassInputField({
  title,
  error,
  register,
  name,
  validate,
  type,
  ...props
}) {
  const masterViewTheme = useSelector(
    (state) => state?.playlistReducer?.masterViewTheme
  );
  return (
    <div className="flex flex-col flex-grow mb-3">
      <label
        className={`block mb-2 text-base font-medium ${masterViewTheme ? "text-black" : "text-white"}  `}
      >
        {title}
      </label>
      <input
        type={type}
        className={` border border-gray-300  text-sm rounded-lg  focus:ring-top-queue-bg block w-full p-5  ${masterViewTheme ? "bg-white  text-black" : " bg-light-tile text-white"}`}
        {...register(name, validate)}
        {...props}
      />
      {error && (
        <span className=" text-red-900 text-xs font-medium">
          {error?.message || "Error"}
        </span>
      )}
    </div>
  );
}

export default ChangePassInputField;
