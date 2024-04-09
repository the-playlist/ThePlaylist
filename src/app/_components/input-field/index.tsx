import React from "react";

function InputField({ title }: { title: string }) {
  return (
    <div className="flex flex-col flex-grow mx-1">
      <label htmlFor="">{title}</label>
      <input className=" border-gray-400 border-2 my-1 p-2 rounded" />
    </div>
  );
}

export default InputField;
