import React from "react";

function FavSongIcon({ color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      fill="none"
      viewBox="0 0 20 21"
    >
      <g fill={color} clipPath="url(#clip0_712_2241)">
        <path d="M12.141 6.39a2.298 2.298 0 01-.76-.726 2.138 2.138 0 01-.335-.971v-.399h-.86v11H8.047c-.794 0-1.557.3-2.119.835a2.782 2.782 0 00-.875 2.017c0 .758.317 1.484.875 2.018A3.072 3.072 0 008.05 21a3.15 3.15 0 002.086-.858c.556-.528.876-1.24.898-1.989V6.575c.188.187.399.356.628.498 3.56 2.26 2.335 5.292 1.814 6.588 0 0-.047.123-.596 1.487a.437.437 0 00-.029.155c0 .055.013.107.038.155a.387.387 0 00.097.13.445.445 0 00.468.074.403.403 0 00.223-.223c.552-1.377.593-1.487.593-1.487.493-1.22 1.996-4.932-2.131-7.565l.003.003z"></path>
        <path d="M18.377 1.574a5.262 5.262 0 00-7.605.1l-.791.817-.791-.816-.022-.023a5.262 5.262 0 00-7.605.023c-2.094 2.173-2.084 5.687.022 7.847l5.185 5.35c.283-.103.58-.174.885-.204L2.128 8.965A4.839 4.839 0 01.778 5.6C.778 2.973 2.84.842 5.39.842A4.517 4.517 0 018.65 2.235L9.711 3.33c.15.155.392.155.543 0l1.061-1.095.022-.023a4.507 4.507 0 016.52.023c1.794 1.866 1.785 4.878-.023 6.727l-2.291 2.364a7.835 7.835 0 01-.195 1.322l3.03-3.126c.034-.032.065-.068.096-.1 2.072-2.196 2.031-5.707-.097-7.848z"></path>
      </g>
      <defs>
        <clipPath id="clip0_712_2241">
          <path fill={color} d="M0 0H20V21H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default FavSongIcon;
