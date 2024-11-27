import React from "react";

function AddSongIcon({ color }: any) {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="10.2941"
        cy="10"
        rx="10.2941"
        ry="10"
        fill={color ? "#1F1F1F" : "#ffff"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.3236 5H9.26474V9L5.14709 9L5.14709 11H9.26474V15H11.3236V11H15.4412V9L11.3236 9V5Z"
        fill={color ? "#ffff" : "#1F1F1F"}
      />
    </svg>
  );
}

export default AddSongIcon;
