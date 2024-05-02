import React from "react";

function ChangePassInputField({
  title,
  error,
  register,
  name,
  validate,
  type,
  ...props
}: {
  title: string;
  error: any;
  register: any;
  name: string;
  validate: any;
  type: string;
}) {
  return (
    <div className="flex flex-col flex-grow mb-3">
      <label className="block mb-2 text-base font-medium text-black ">
        {title}
      </label>
      <input
        type={type}
        className=" border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-top-queue-bg block w-full p-5 "
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
