import React, { useState } from "react";
import moment from "moment";
import Delta from "quill-delta";
import {
  Card,
  IconButton,
  CardHeader,
  Typography,
  CardContent,
  CardActionArea,
  makeStyles
} from "@material-ui/core/";
// import useMediaQuery from "@material-ui/core/useMediaQuery";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { deltaToPlainText } from "../../helpers/helpers";

const useStyles = makeStyles({
  card: {
    // maxWidth: "100%",
    maxWidth: "345",
    marginBottom: "0.5rem",
    margin: "0 0.5rem 0.5rem"
    // boxShadow:
    //   "0px 1px 8px 0px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 3px 3px -2px rgba(0,0,0,0.12)"
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

const MediaCard = props => {
  const classes = useStyles();
  const [raised, setRaised] = useState(false);
  // const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // const matches = useMediaQuery("(min-width:350px)");

  const toggleRaised = () => {
    setRaised(!raised);
  };

  const previewText = str => {
    const parsedDelta = new Delta(JSON.parse(str));
    let plainText = deltaToPlainText(parsedDelta);
    // console.log(plainText);
    if (plainText.length > 300) {
      return plainText.slice(0, 300).concat("...");
    }
    return plainText;
  };

  // console.log(matches);
  return (
    <Card
      onMouseOver={toggleRaised}
      onMouseOut={toggleRaised}
      raised={raised}
      className={classes.card}
      // style={matches ? { maxWidth: "100%" } : {}}
      // style={smallScreen && props.activeNote ? { display: "none" } : {}}
      // style={props.activeNote && { flexBasis: "250px" }}
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

export default MediaCard;
