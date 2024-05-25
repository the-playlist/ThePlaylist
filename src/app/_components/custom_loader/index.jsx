import React from "react";

const CustomLoader = ({ bgColor }) => {
  return (
    <div className=" min-h-screen flex justify-center items-center">
      <span
        className={`loading loading-bars loading-xs ${bgColor ? bgColor : ""}`}
      ></span>
      <span
        className={`loading loading-bars loading-sm ${bgColor ? bgColor : ""}`}
      ></span>
      <span
        className={`loading loading-bars loading-md ${bgColor ? bgColor : ""}`}
      ></span>
      <span
        className={`loading loading-bars loading-lg ${bgColor ? bgColor : ""}`}
      ></span>
    </div>
  );
};

export default CustomLoader;
