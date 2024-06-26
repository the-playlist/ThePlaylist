import React from "react";

const GenericButton = ({
  text,
  onClick,
  disabled = false,
  loading = false,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex w-full btn bg-primary text-black"
    >
      {loading ? (
        <span className="loading loading-spinner loading-md"></span>
      ) : (
        text
      )}
    </button>
  );
};

export default GenericButton;
