import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Avatar, Typography } from "@material-ui/core/";

const useStyles = makeStyles(
  createStyles({
    avatar: {
      margin: 10,
      width: "25px",
      height: "25px",
      fontSize: "0.8rem"
    },
    notecount: {
      flexGrow: 1
    }
  })
);

const NoteCounter = ({ noteNumber }) => {
  const classes = useStyles();
  return (
    <>
      <Avatar className={classes.avatar}>{noteNumber}</Avatar>
      <Typography
        variant="subtitle1"
        component="span"
        display="block"
        color="inherit"
        className={classes.notecount}
      >
        {noteNumber && noteNumber === 1 ? " note" : " notes"}
      </Typography>
    </>
  );
};

export default NoteCounter;
