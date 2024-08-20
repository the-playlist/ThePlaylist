import React from "react";

export const CustomLoader = ({ bgColor }) => {
  return (
    <div className=" mt-[40%] flex justify-center items-center">
      <span className={`loading loading-bars loading-xs ${bgColor}`}></span>
      <span className={`loading loading-bars loading-sm ${bgColor}`}></span>
      <span className={`loading loading-bars loading-md ${bgColor}`}></span>
      <span className={`loading loading-bars loading-lg ${bgColor}`}></span>
    </div>
  );
};
