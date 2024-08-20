import React from "react";

interface EllipsisTextProps {
  text: string;
  length: number;
  tooltip?: boolean; // Optional: Show full text in a tooltip on hover
}

export const EllipsisText: React.FC<EllipsisTextProps> = ({ text, length }) => {
  // Check if the text needs to be truncated
  const truncatedText =
    text?.length > length ? `${text.slice(0, length)}...` : text;

  return (
    <span
      className="text-stone-800 text-base font-normal"
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {truncatedText}
    </span>
  );
};
