import React, { useContext } from "react";
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
  MenuItem,
  useMediaQuery
} from "@material-ui/core/";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { deltaToPlainText } from "../../helpers/helpers";
import {
  DeleteOutlineOutlined,
  StarBorderOutlined,
  StarRounded,
  EditOutlined
} from "@material-ui/icons";

import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import {
  NOTE_ADD_FAVORITE,
  NOTE_REMOVE_FAVORITE
} from "../../context/rootReducer";
import {
  noteFavoriteFalseReq,
  noteFavoriteTrueReq
} from "../../requests/requests";
import { formatTitle } from "../../helpers/helpers";
import { useScreenWidth } from "../../helpers/customHooks/useScreenWidth";

const useStyles = makeStyles({
  card: {
    maxWidth: "345",
    marginBottom: "0.5rem",
    margin: "0 0.5rem 0.5rem",
    wordWrap: "break-word",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#eeeeee",
      boxShadow:
        "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)"
    }
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
  },
  content: {
    maxWidth: "80%"
  },
  action: {
    marginLeft: "auto"
  },
  //removes the default hover effect on cardActionArea
  actionArea: {
    "&:hover $focusHighlight": {
      opacity: 0
    }
  },
  focusHighlight: {}
});

const HeaderActions = props => {
  const appState = useContext(StateContext);
  const note = appState.notes.filter(note => note._id === props.noteID)[0];
  const confirmDelete = (note, e) => {
    e.stopPropagation();
    //  1)Grabs the id of the note  2)opens the confirm delete dialog
    props.openDeleteDialog(note);
  };

  return (
    <div>
      <IconButton
        aria-haspopup="true"
        color="inherit"
        title="Delete Note"
        onClick={confirmDelete.bind(this, note)}
      >
        <DeleteOutlineOutlined />
      </IconButton>
      <IconButton
        aria-haspopup="true"
        color="inherit"
        title="Rename Note"
        onClick={e => {
          e.stopPropagation();
          props.openRenameDialog(note);
        }}
      >
        <EditOutlined />
      </IconButton>
      <IconButton
        aria-haspopup="true"
        color="inherit"
        title={
          note && note.favorite ? "Remove from Favorites" : "Add to Favorites"
        }
        onClick={props.toggleFavorite}
      >
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
  const scrWidth600up = useScreenWidth();
  const mediumScreen = useMediaQuery("(min-width:900px)");
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  function CloseNoteMenu(event, id) {
    setAnchorEl(event.currentTarget);
  }

  function closeNoteMenu(e) {
    setAnchorEl(null);
  }
  //end menu

  const noteTemp = appState.notes.filter(note => note._id === props.id)[0];
  const note = noteTemp ? noteTemp : appState.notes[0];
  /** noteTemp will be undefined when a new note is created:
   * CREATE_NOTE reducer runs --> creates a temporary note with a temporary note._id that is the notes name
   * SET_ACTIVE_NOTE reducer runs --> sets the newly created note as active note (note expands)
   * SYNC_NEW_NOTE reducer runs --> filters out the temporary note and
   * appends the note that returned as response from the server (which now has the correct note._id)
   * the notes are filtered by date of creation so the new note will be the first one in appState.notes
   * */

  const previewText = str => {
    const parsedDelta = new Delta(JSON.parse(str));
    let plainText = deltaToPlainText(parsedDelta);
    if (plainText.length > 300) {
      return plainText.slice(0, 300).concat("...");
    }
    return plainText;
  };

  const toggleFavorite = e => {
    e.stopPropagation();
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

  return (
    <>
      <Card onClick={props.expandNote} className={classes.card}>
        <CardHeader
          classes={{
            title: classes.title,
            subheader: classes.subheader,
            content: classes.content,
            action: classes.action
          }}
          action={
            appState.activeNote || !scrWidth600up ? (
              <IconButton
                aria-label="More"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={e => {
                  e.stopPropagation();
                  CloseNoteMenu(e, props.id);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            ) : (
              <HeaderActions
                noteID={props.id}
                openDeleteDialog={props.openDeleteDialog}
                openRenameDialog={props.openRenameDialog}
                toggleFavorite={toggleFavorite}
              />
            )
          }
          title={mediumScreen ? props.name : formatTitle(props.name)}
          subheader={moment(props.updated).format("LLL")}
        />

        <hr style={{ margin: 0 }} />
        <CardActionArea
          onClick={props.expandNote}
          classes={{
            root: classes.actionArea,
            focusHighlight: classes.focusHighlight
          }}
        >
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
        <MenuItem
          onClick={e => {
            toggleFavorite(e);
            closeNoteMenu();
          }}
        >
          {note && note.favorite ? "Remove from Favorites" : "Add to Favorites"}
        </MenuItem>
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
