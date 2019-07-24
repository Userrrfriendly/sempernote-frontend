import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";
import { NOTES, NOTEBOOK, TAG, TRASH } from "../../context/activeUItypes";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  ClickAwayListener,
  InputAdornment
} from "@material-ui/core/";
import {
  DeleteRounded,
  DeleteForeverRounded,
  RestoreFromTrash,
  StarRounded,
  Info,
  SaveRounded,
  ArrowBack,
  CheckRounded
} from "@material-ui/icons";
import NoteCounter from "./noteCounter";
import SortMenu from "./sortMenu";
import SelectNotebook from "./selectNotebook";
import SelectTag from "./selectTag";
import { find as _find } from "lodash";
import {
  noteFavoriteFalseReq,
  noteFavoriteTrueReq,
  renameNoteReq
} from "../../requests/requests";
import {
  NOTE_ADD_FAVORITE,
  NOTE_REMOVE_FAVORITE,
  SET_ACTIVE_NOTE,
  RENAME_NOTE
} from "../../context/rootReducer";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    marginBottom: "1rem",
    width: "100%"
  },
  notecontainer: {
    overflowY: "scroll",
    maxHeight: "calc(100vh - 98px)",
    width: "100%"
  },
  title: {
    flexGrow: 1
  },
  note_name: {
    height: "42px",
    flexGrow: 1,
    backgroundColor: "#fff"
    // maxWidth: "450px"
  },
  arrow: {
    marginLeft: "1.5rem"
  }
});

// required for react-router-dom < 6.0.0
// see https://github.com/ReactTraining/react-router/issues/6056#issuecomment-435524678
const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

const MainAppBar = props => {
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  // title refers to display title in appBar ('ALL NOTES', 'Notes Tagged as ...',etc)
  const [title, setTitle] = useState(null);
  // noteTitle refers to note title displayed in the appbar when a note is opened (activeNote)
  const [noteTitle, setNoteTitle] = useState(null);
  //renameNoteOpen refers the input box where the note title can be renamed if a note is expanded (activeNote)
  const [renameNoteOpen, setRenameNoteOpen] = useState(false);
  const [noteNumber, setNoteNumber] = useState(null);
  const classes = useStyles();

  const updateNoteTitle = () => {
    const str = noteTitle;
    if (renameNoteOpen && str && str.trim() !== "") {
      // if str is not empty:
      const existingNotes = appState.notes.reduce(
        (accumulator, currentValue) => {
          accumulator.push(currentValue.title.toLowerCase());
          return accumulator;
        },
        []
      );
      if (existingNotes.includes(str.toLocaleLowerCase().trim())) {
        // setError("A note with the same title already exists!");
        console.log("A note with the same title already exists!");
      } else {
        setRenameNoteOpen(false);

        dispatch({
          type: RENAME_NOTE,
          _id: appState.activeNote._id,
          newTitle: str.trim()
        });
        renameNoteReq(appState.activeNote._id, str.trim(), appState.token).then(
          r => console.log(r)
        );

        // setError(false);
      }
    } else {
      // setError("Note title must be at least one character long");
      console.log("Note title must be at least one character long");
    }
    setRenameNoteOpen(false);
  };

  const handleClickAway = () => {
    //handles Click away from the Rename-Note-Title input
    setRenameNoteOpen(false);
    updateNoteTitle();
  };

  const handleRenameNoteClick = e => {
    //when clicked on the note title in the appbar the <Typography> Element is replaced with an <Input>
    if (appState.activeNote) {
      setNoteTitle(appState.activeNote.title);
      setRenameNoteOpen(true);
    }
  };

  const handleRenameChange = e => {
    if (e.target.value.length < 50) setNoteTitle(e.target.value);
  };

  const noteToggleFavorite = () => {
    if (appState.activeNote.favorite) {
      noteFavoriteFalseReq(appState.activeNote, appState.token);
      dispatch({
        type: NOTE_REMOVE_FAVORITE,
        note: appState.activeNote
      });
    } else {
      noteFavoriteTrueReq(appState.activeNote, appState.token);
      dispatch({
        type: NOTE_ADD_FAVORITE,
        note: appState.activeNote
      });
    }
  };

  useEffect(() => {
    //this determines what will be rendered in the AppBar deppending on the global state
    console.log("Appbar did update");
    if (appState.activeNote) {
      appState.activeNote.trash
        ? setTitle(appState.activeNote.title + " (TRASH)")
        : setTitle(appState.activeNote.title);
    } else {
      switch (appState.noteFilter.name) {
        case NOTES:
          setTitle("ALL NOTES");
          setNoteNumber(appState.notes ? appState.notes.length : 0);
          break;
        case NOTEBOOK:
          setTitle(
            'Notebook: "' +
              appState.notebooks.filter(
                notebook => notebook._id === appState.noteFilter.options
              )[0].name +
              '"'
          );
          const notesInNotebook = appState.notes
            ? appState.notes
                .filter(
                  note => note.notebook._id === appState.noteFilter.options
                )
                .map(note => note)
            : null;
          setNoteNumber(notesInNotebook ? notesInNotebook.length : 0);
          break;
        case TAG:
          setTitle(
            'Notes tagged with: "' +
              appState.tags.filter(
                tag => tag._id === appState.noteFilter.options
              )[0].tagname +
              '"'
          );
          const notesInTags = appState.notes
            ? appState.notes.filter(note =>
                _find(note.tags, { _id: appState.noteFilter.options })
              )
            : null;
          setNoteNumber(notesInTags ? notesInTags.length : 0);
          break;
        case TRASH:
          setTitle(
            'Notebook: "' +
              appState.notebooks.filter(
                notebook => notebook._id === appState.noteFilter.options
              )[0].name +
              '"'
          );
          const notesInTrash = appState.notes
            ? appState.notes.filter(
                note => note.notebook._id === appState.noteFilter.options
              )
            : null;
          setNoteNumber(notesInTrash ? notesInTrash.length : 0);
          break;
        default:
          throw new Error("Invalid argument in activeUI");
      }
    }
  }, [
    appState.notes,
    appState.activeNote,
    appState.noteFilter,
    appState.notebooks,
    appState.tags,
    noteTitle
  ]);

  const titleStyle = () => {
    if (appState.activeNote) {
      return appState.activeNote && !appState.activeNote.trash
        ? { flexGrow: 1, cursor: "pointer" }
        : { flexGrow: 1 };
    } else {
      return {};
    }
  };

  return (
    <>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar style={{ justifyContent: "space-between" }}>
            {renameNoteOpen &&
            appState.activeNote &&
            !appState.activeNote.trash ? (
              <ClickAwayListener onClickAway={handleClickAway}>
                <TextField
                  id="outlined-simple-start-adornment"
                  classes={{
                    root: classes.note_name
                  }}
                  onChange={handleRenameChange}
                  onKeyDown={e => {
                    if (e.keyCode === 27) setRenameNoteOpen(false); // if escape key is pressed close rename
                    if (e.keyCode === 13) updateNoteTitle(); // if enter key is pressed trigger save
                  }}
                  variant="outlined"
                  label="Rename Note"
                  value={noteTitle}
                  InputProps={{
                    classes: {
                      root: classes.note_name
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          style={{ padding: "8px" }}
                          aria-label="Change Title"
                          onClick={updateNoteTitle}
                        >
                          <CheckRounded />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </ClickAwayListener>
            ) : (
              <Typography
                onClick={
                  appState.activeNote && !appState.activeNote.trash
                    ? handleRenameNoteClick
                    : () => {}
                }
                variant={title && title.length > 20 ? "subtitle1" : "h6"}
                component="h1"
                color="inherit"
                style={titleStyle()}
              >
                {title}
              </Typography>
            )}
            {appState.notes && !appState.activeNote && (
              <>
                <NoteCounter noteNumber={noteNumber} />

                <SortMenu />
              </>
            )}
            {/* RENDER A REGULAR NOTE (not TRASH) */}
            {appState.activeNote && !appState.activeNote.trash && (
              <>
                <Tooltip title="Back">
                  <IconButton
                    className={classes.arrow}
                    aria-haspopup="true"
                    color="inherit"
                    component={AdapterLink}
                    to="/main/"
                    onClick={() => {
                      handleClickAway();
                      dispatch({
                        type: SET_ACTIVE_NOTE,
                        note: null
                      });
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Save changes">
                  <IconButton color="inherit">
                    <SaveRounded />
                  </IconButton>
                </Tooltip>

                <SelectNotebook />

                <SelectTag />

                <Tooltip title="Favorites">
                  <IconButton onClick={noteToggleFavorite} color="inherit">
                    <StarRounded
                      style={
                        appState.activeNote.favorite ? { color: "gold" } : {}
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Note info">
                  <IconButton aria-haspopup="true" color="inherit">
                    <Info />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Note">
                  <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    onClick={props.openDeleteDialog.bind(
                      this,
                      appState.activeNote
                    )}
                  >
                    <DeleteRounded />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {/* RENDER TRASHED NOTE */}
            {appState.activeNote && appState.activeNote.trash && (
              <>
                <Tooltip title="Back">
                  <IconButton
                    className={classes.arrow}
                    aria-haspopup="true"
                    color="inherit"
                    component={AdapterLink}
                    to="/main/"
                    onClick={() => {
                      dispatch({
                        type: SET_ACTIVE_NOTE,
                        note: null
                      });
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                </Tooltip>

                <SelectNotebook />

                <SelectTag />

                <Tooltip title="Permanent Delete">
                  <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    onClick={props.openDeleteDialog.bind(
                      this,
                      appState.activeNote
                    )}
                  >
                    <DeleteForeverRounded style={{ color: "red" }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Note info">
                  <IconButton aria-haspopup="true" color="inherit">
                    <Info />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Restore Note">
                  <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    onClick={props.restoreNote.bind(this, appState.activeNote)}
                  >
                    <RestoreFromTrash style={{ color: "green" }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Toolbar>
        </AppBar>
      </div>
    </>
  );
};

export default MainAppBar;
