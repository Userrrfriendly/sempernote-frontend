import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Avatar, Typography } from "@material-ui/core/";
// import deepOrange from '@material-ui/core/colors/deepOrange';
// import deepPurple from '@material-ui/core/colors/deepPurple';
// import Grid from '@material-ui/core/Grid';

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
  // const ...props
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
        {/* {noteNumber && (noteNumber > 1 || noteNumber === 0)           ? " notes"
          : " note" */}

        {noteNumber && noteNumber === 1 ? " note" : " notes"}
      </Typography>
    </>
  );
};

export default NoteCounter;
