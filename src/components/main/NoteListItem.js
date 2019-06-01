import React from "react";
import moment from "moment";
import Delta from "quill-delta";
// import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  IconButton,
  CardHeader,
  Typography,
  CardContent,
  CardActionArea,
  makeStyles
} from "@material-ui/core/";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MoreVertIcon from "@material-ui/icons/MoreVert";
// import { withStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    marginBottom: "0.5rem",
    margin: "0 0.5rem 0.5rem",
    boxShadow:
      "0px 1px 8px 0px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12)"
  },
  media: {
    height: 140
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: "500"
  },
  subheader: {
    fontSize: "0.87rem"
  }
});

// const styleOverrides = theme => ({
//   card: {
//     maxWidth: 345,
//     marginBottom: "0.5rem",
//     margin: "0 0.5rem 0.5rem",
//     boxShadow:
//       "0px 1px 8px 0px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12)"
//   },
//   media: {
//     height: 140
//   },
//   title: {
//     fontSize: "3rem"
//   }
// });

const MediaCard = props => {
  const classes = useStyles(); //hook

  // const { classes } = props;
  const matches = useMediaQuery("(min-width:350px)");
  const previewText = str => {
    //toPlaintext() is from https://github.com/purposeindustries/quill-delta-to-plaintext
    function toPlaintext(delta) {
      return delta.reduce(function(text, op) {
        if (!op.insert)
          throw new TypeError("only `insert` operations can be transformed!");
        if (typeof op.insert !== "string") return text + " ";
        return text + op.insert;
      }, "");
    }

    const parsedDelta = new Delta(JSON.parse(str));
    let plainText = toPlaintext(parsedDelta);
    // console.log(plainText);
    if (plainText.length > 300) {
      return plainText.slice(0, 300).concat("...");
    }
    return plainText;
  };

  // console.log(matches);
  return (
    <Card
      // raised
      // classes={{
      //   root: classes.root,
      //   media: classes.media,
      //   title: classes.title
      // }}
      className={classes.card}
      style={matches ? { maxWidth: "100%" } : {}}
    >
      {/* <h1>
        MATCHES:
        {matches ? "true" : "false"}
      </h1> */}

      <CardHeader
        classes={{ title: classes.title, subheader: classes.subheader }}
        action={
          <IconButton
            onClick={() => {
              console.log("test");
            }}
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={props.name}
        subheader={moment(props.updated).format("LLL")}
      />

      <hr style={{ margin: 0 }} />
      <CardActionArea onClick={props.expandNote}>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {previewText(props.body)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

// export default withStyles(styleOverrides)(MediaCard);
export default MediaCard;
