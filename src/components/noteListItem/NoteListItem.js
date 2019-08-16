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
      backgroundColor: "#eeeeee"
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
        title={note.favorite ? "Remove from Favorites" : "Add to Favorites"}
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
  const [raised, setRaised] = useState(false);
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
  const note = appState.notes.filter(note => note._id === props.id)[0];

  const toggleRaised = () => {
    setRaised(!raised);
  };

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
      <Card
        onClick={props.expandNote}
        onMouseOver={toggleRaised}
        onMouseOut={toggleRaised}
        raised={raised}
        className={classes.card}
      >
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
          {note.favorite ? "Remove from Favorites" : "Add to Favorites"}
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
