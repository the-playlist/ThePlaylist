import React from "react";

function InputField({
  title,
  error,
  register,
  name,
  validate,
  isPhone,
  ...props
}: {
  title: string;
  error: any;
  register: any;
  name: string;
  validate: any;
  isPhone: boolean;
}) {
  return (
    <div className="flex flex-col flex-grow mx-1">
      <label htmlFor="">{title}</label>
      <div className="border-gray-400 border-2 my-1 p-2 rounded">
        {isPhone && (
          <span className="bg-gray-2 text-gray-3 rounded p-1 mr-1 ">+1</span>
        )}
        <input
          className="focus:outline-none"
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
