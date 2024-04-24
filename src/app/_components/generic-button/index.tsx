import { title } from "process";
import React from "react";

const GenericButton = ({
  text,
  onClick,
  disabled = false,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex w-full btn bg-primary text-black"
    >
      {text}
    </button>
  );
};

export default GenericButton;
