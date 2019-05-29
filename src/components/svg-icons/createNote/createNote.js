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
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      fill={fill}
      d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"
    />
  </svg>
);

export default SVG;
