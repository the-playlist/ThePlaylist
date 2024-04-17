import React from "react";

function InputField({
  title,
  error,
  register,
  name,
  validate,
  ...props
}: {
  title: string;
  error: any;
  register: any;
  name: string;
  validate: any;
}) {
  return (
    <div className="flex flex-col flex-grow mx-1">
      <label htmlFor="">{title}</label>
      <input
        className=" border-gray-400 border-2 my-1 p-2 rounded"
        { ...register(name, validate)}
        {...props}
      />
      {error && (
        <span className=" text-red-900 text-xs font-medium">
          This is required
        </span>
      )}
    </div>
  );
}

export default InputField;
