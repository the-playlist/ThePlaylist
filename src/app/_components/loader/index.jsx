import CircularProgress from "@mui/joy/CircularProgress";
import React from "react";

export const Loader = ({ props }) => {
  return (
    <div className="flex items-center justify-center" {...props}>
      <CircularProgress color="warning" variant="outlined" />
    </div>
  );
};
