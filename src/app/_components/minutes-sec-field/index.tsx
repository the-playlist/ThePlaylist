import React from "react";

function MinuteSecField({
  title,
  error,
  error2,
  register,
  name1,
  name2,
  validate,

  ...props
}: {
  title: string;
  error: any;
  error2: any;
  register: any;
  name1: string;
  validate: any;
  name2: any;
}) {
  return (
    <div className="flex flex-col flex-grow mx-1">
      <label htmlFor="">{"Song Duration"}</label>
      <div className=" border-gray-400 rounded  border-2 my-1 p-2 flex w-full">
        <input
          placeholder="Minutes"
          {...register(name1, validate)}
          {...props}
          className="px-3   w-full   focus:outline-none"
        />
        <div className=" border-r-2 border-gray-400" />
        <input
          placeholder="Seconds"
          {...register(name2, validate)}
          {...props}
          className="px-2 w-full  focus:outline-none"
        />
      </div>
      <div className="flex w-full justify-between items-center">
        {error && (
          <span className=" text-red-900 text-xs font-medium">
            {error?.message || "Error"}
          </span>
        )}
        {error2 && (
          <div className="w1/2">
            <span className=" text-red-900 text-start text-xs font-medium">
              {error2?.message || "Error"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MinuteSecField;
