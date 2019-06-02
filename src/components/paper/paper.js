import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
// import Typography from '@material-ui/core/Typography';
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(3, 2)
    padding: "4px 8px 8px",
    display: "flex",
    flexWrap: "wrap",
    minWidth: "calc(100vw - 60px)",
    marginLeft: "60px"
  }
}));

const PaperSheet = props => {
  const classes = useStyles();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));
  console.log(smallScreen);
  return (
    <div>
      <Paper
        className={classes.root}
        style={smallScreen ? { marginLeft: 0 } : {}}
      >
        {props.children}
      </Paper>
    </div>
  );
};

export default PaperSheet;
