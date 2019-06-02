import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
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
    }
  })
);

const NoteCounter = props => {
  const classes = useStyles();

  return <Avatar className={classes.avatar}>{props.children}</Avatar>;
};

export default NoteCounter;
