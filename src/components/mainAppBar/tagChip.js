import React from "react";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    maxWidth: "120px"
  },
  chip: {
    maxWidth: "75px",
    color: "rgba(0, 0, 0, 0.87)",
    border: "none",
    cursor: "default",
    height: "32px",
    outline: "none",
    padding: "6px",
    fontSize: "0.8125rem",
    boxSizing: "border-box",
    transition:
      "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    borderRadius: "16px",
    backgroundColor: "#e0e0e0",
    margin: "2px",
    "@media (min-width: 1500px)": {
      maxWidth: "120px"
    }
  }
}));

export default function TagChip(props) {
  const classes = useStyles();

  return (
    <Typography
      className={classes.chip}
      variant="subtitle2"
      component="span"
      noWrap={true}
    >
      {props.children}
    </Typography>
  );
}
