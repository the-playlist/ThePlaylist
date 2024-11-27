import React from "react";
import { useSelector } from "react-redux";

interface EllipsisTextProps {
  text: string;
  length: number;
  tooltip?: boolean; // Optional: Show full text in a tooltip on hover
  isFixed?: boolean;
  color?: string;
}

export const EllipsisText: React.FC<EllipsisTextProps> = ({
  text,
  length,
  isFixed,
  color,
  ...props
}) => {
  const masterViewTheme = useSelector(
    (state: any) => state?.playlistReducer?.masterViewTheme
  );
  const truncatedText =
    text?.length > length ? `${text.slice(0, length)}...` : text;

  return (
    <span
      className={`${color ? color : isFixed ? "text-stone-800" : masterViewTheme ? "text-stone-800" : "text-white"}  text-base font-normal`}
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      {...props}
    >
      {truncatedText}
    </span>
  );
};
