import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useScreenWidth } from "../../helpers/customHooks/useScreenWidth";
import { useScreenHeight } from "../../helpers/customHooks/useScreenHeight";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "4px 8px 8px",
    display: "flex",
    flexWrap: "wrap",
    minWidth: "calc(100vw - 60px)"
  }
}));

const PaperSheet = props => {
  const scrWidth600up = useScreenWidth();
  const scrHeight600up = useScreenHeight();

  const classes = useStyles();
  return (
    <div>
      <Paper
        className={classes.root}
        style={
          scrWidth600up && scrHeight600up
            ? { marginLeft: "60px" }
            : { marginLeft: 0 }
        }
      >
        {props.children}
      </Paper>
    </div>
  );
};

export default PaperSheet;
