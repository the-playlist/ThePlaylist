import { title } from "process";
import React from "react";

const GenericButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <button onClick={onClick} className="flex w-full btn bg-primary text-white">
      {text}
    </button>
  );
};

export default GenericButton;
