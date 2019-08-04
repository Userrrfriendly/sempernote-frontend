import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useScreenSize } from "../../helpers/useScreenSize";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "4px 8px 8px",
    display: "flex",
    flexWrap: "wrap",
    minWidth: "calc(100vw - 60px)"
  }
}));

const PaperSheet = props => {
  const scrSize = useScreenSize();

  const classes = useStyles();
  return (
    <div>
      <Paper
        className={classes.root}
        style={scrSize ? { marginLeft: "60px" } : { marginLeft: 0 }}
      >
        {props.children}
      </Paper>
    </div>
  );
};

export default PaperSheet;
