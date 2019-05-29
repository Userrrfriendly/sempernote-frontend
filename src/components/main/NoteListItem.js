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

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    marginBottom: "0.5rem",
    margin: "0 0.5rem 0.5rem"
  },
  media: {
    height: 140
  }
});

const MediaCard = props => {
  const classes = useStyles(); //hook
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
    console.log(plainText);
    if (plainText.length > 400) {
      return plainText.slice(0, 400).concat("...");
    }
    return plainText;
  };

  return (
    <Card className={classes.card} style={matches ? { maxWidth: "100%" } : {}}>
      <CardHeader
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

export default MediaCard;
