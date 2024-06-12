import React from "react";

function PlaylistIcon({ color }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 12 11"
    >
      <rect width="11" height="1" fill={color} rx="0.5"></rect>
      <rect width="11" height="1" y="3" fill={color} rx="0.5"></rect>
      <rect width="6" height="1" y="6" fill={color} rx="0.5"></rect>
      <rect width="6" height="1" y="9" fill={color} rx="0.5"></rect>
      <path stroke={color} d="M11 8L8 9.732V6.268L11 8z"></path>
    </svg>
  );
}

export default PlaylistIcon;
