import React from "react";

const SVG = ({
  style = {},
  fill = "#000",
  width = "24",
  className = "",
  viewBox = "0 0 24 24"
}) => (
  <svg
    width={width}
    style={style}
    height={width}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    className={`${className || ""}`}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path
      fill={fill}
      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
    />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

export default SVG;
