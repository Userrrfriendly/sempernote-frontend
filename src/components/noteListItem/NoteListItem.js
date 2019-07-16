import React, { useState, useContext } from "react";
import moment from "moment";
import Delta from "quill-delta";
import {
  Card,
  IconButton,
  CardHeader,
  Typography,
  CardContent,
  CardActionArea,
  makeStyles,
  Menu,
  MenuItem
} from "@material-ui/core/";
// import useMediaQuery from "@material-ui/core/useMediaQuery";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { deltaToPlainText } from "../../helpers/helpers";
import {
  DeleteOutlineOutlined,
  InfoOutlined,
  StarBorderOutlined,
  StarRounded
} from "@material-ui/icons";

import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import {
  NOTE_ADD_FAVORITE,
  NOTE_REMOVE_FAVORITE
  // TRASH_NOTE
} from "../../context/rootReducer";
import {
  noteFavoriteFalseReq,
  noteFavoriteTrueReq
  // trashNoteReq
} from "../../requests/requests";

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

const HeaderActions = props => {
  const dispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  // console.log(props.noteID);
  const note = appState.notes.filter(note => note._id === props.noteID)[0];
  const toggleFavorite = () => {
    if (note.favorite) {
      dispatch({
        type: NOTE_REMOVE_FAVORITE,
        note: note
      });
      noteFavoriteFalseReq(note, appState.token);
    } else {
      dispatch({
        type: NOTE_ADD_FAVORITE,
        note: note
      });
      noteFavoriteTrueReq(note, appState.token);
    }
  };

  const confirmDelete = note => {
    //  1)Grabs the id of the note  2)opens the confirm delete dialog
    props.openDeleteDialog(note);
  };

  return (
    <div>
      <IconButton
        aria-haspopup="true"
        color="inherit"
        onClick={confirmDelete.bind(this, note)}
      >
        <DeleteOutlineOutlined />
      </IconButton>
      <IconButton
        aria-haspopup="true"
        color="inherit"
        onClick={() => console.log("test")}
      >
        <InfoOutlined />
      </IconButton>
      <IconButton aria-haspopup="true" color="inherit" onClick={toggleFavorite}>
        {note && note.favorite ? (
          <StarRounded style={{ color: "gold" }} />
        ) : (
          <StarBorderOutlined />
        )}
      </IconButton>
    </div>
  );
};

const NoteListItem = props => {
  const classes = useStyles();
  const [raised, setRaised] = useState(false);
  // const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // const matches = useMediaQuery("(min-width:350px)");

  const appState = useContext(StateContext);
  // const dispatch = useContext(DispatchContext);
  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [anchorElID, setAnchorElID] = React.useState(null);

  function CloseNoteMenu(event, id) {
    // setAnchorElID(id);
    setAnchorEl(event.currentTarget);
  }

  function closeNoteMenu(e) {
    setAnchorEl(null);
    // setAnchorElID(null);
  }
  //end menu
  const note = appState.notes.filter(note => note._id === props.id)[0];

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
    <>
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
            appState.activeNote ? (
              <IconButton
                aria-label="More"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={e => CloseNoteMenu(e, props.id)}
              >
                <MoreVertIcon />
              </IconButton>
            ) : (
              <HeaderActions
                noteID={props.id}
                openDeleteDialog={props.openDeleteDialog}
              />
            )
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
      <Menu
        elevation={1}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeNoteMenu}
      >
        <MenuItem onClick={closeNoteMenu}>Info</MenuItem>
        <MenuItem
          onClick={e => {
            props.openDeleteDialog(note);
            closeNoteMenu();
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          onClick={e => {
            props.openRenameDialog(note);
            closeNoteMenu();
          }}
        >
          Rename
        </MenuItem>
      </Menu>
    </>
  );
};

export default NoteListItem;
