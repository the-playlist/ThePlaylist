import { title } from "process";
import React from "react";

const GenericButton = ({ text }: { text: string }) => {
  return (
    <button className="flex w-full btn bg-primary text-white">{text}</button>
  );
};

export default GenericButton;
