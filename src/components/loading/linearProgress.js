import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

const LinearIndeterminate = props => {
  const classes = useStyles();
  //due to various CSS rules the LinearProgress didn't grow in some cases unless width was set to 100vw, thus the props injection
  return (
    <div className={classes.root}>
      <LinearProgress style={props.width} />
    </div>
  );
};

export default LinearIndeterminate;
