"use client";
import React from "react";

export const AddPlayerButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className=" self-end btn btn-primary bg-primary border-none text-black hover:bg-primary"
    >
      + Add New Player
    </button>
  );
};
