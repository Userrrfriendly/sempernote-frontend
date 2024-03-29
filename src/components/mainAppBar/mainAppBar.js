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
  InputAdornment,
  useMediaQuery
} from "@material-ui/core/";
import {
  DeleteRounded,
  DeleteForeverRounded,
  RestoreFromTrash,
  StarRounded,
  // Info,
  SaveRounded,
  ArrowBack,
  CheckRounded,
  MenuRounded
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
import { formatTitle } from "../../helpers/helpers";
import { useScreenWidth } from "../../helpers/customHooks/useScreenWidth";
import { useScreenHeight } from "../../helpers/customHooks/useScreenHeight";

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  root: {
    flexGrow: 1,
    marginBottom: "1rem",
    width: "100%"
  },
  note_name: {
    height: "42px",
    flexGrow: 1,
    backgroundColor: "#fff"
  },
  arrow: {
    marginLeft: "1.5rem"
  },
  title_container: {
    maxWidth: "70%"
  },
  title_container_expanden_note: {
    maxWidth: "70%",
    flexGrow: 1
  },
  title: {
    overflow: "hidden",
    whiteSpace: "wrap",
    textOverflow: "ellipsis"
  },
  title_sm: {
    overflow: "hidden",
    whiteSpace: "wrap",
    textOverflow: "ellipsis",
    fontSize: "0.8rem"
  },
  toolbar: {
    flexFlow: "column",
    alignItems: "center"
  },
  toolbar_large: {
    alignItems: "center"
  },
  icon_container: {
    flexFlow: "row",
    display: "flex",
    flexShrink: 0
  }
}));

// required for react-router-dom < 6.0.0
// see https://github.com/ReactTraining/react-router/issues/6056#issuecomment-435524678
const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

const MainAppBar = props => {
  const scrHeigth600Up = useScreenHeight();
  const scrWidth630Down = useMediaQuery("(max-width:630px)");
  const scrWidth900Up = useMediaQuery("(min-width:900px)");
  const scrWidth600up = useScreenWidth();
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
    if (e.target.value.length <= 50) setNoteTitle(e.target.value);
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
      {/* classes.appBar is passed as props from the main because of the dynamic drawer width */}
      <div className={props.classes.appBar}>
        <AppBar position="static" color="default">
          <Toolbar
            style={
              scrWidth600up
                ? { justifyContent: "space-between" }
                : { justifyContent: "flex-start" }
            }
            className={
              appState.activeNote && scrWidth630Down ? classes.toolbar : ""
            }
          >
            {!appState.activeNote && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={props.handleDrawerToggle}
                className={classes.menuButton}
                style={
                  scrWidth600up && scrHeigth600Up ? { display: "none" } : {}
                }
              >
                <MenuRounded />
              </IconButton>
            )}
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
              <div
                className={
                  appState.activeNote
                    ? classes.title_container_expanden_note
                    : classes.title_container
                }
                style={!scrWidth600up ? { maxWidth: "95%" } : {}}
              >
                <Typography
                  onClick={
                    appState.activeNote && !appState.activeNote.trash
                      ? handleRenameNoteClick
                      : () => {}
                  }
                  variant={title && title.length > 20 ? "subtitle1" : "h6"}
                  component="h1"
                  color="inherit"
                  className={
                    title && title.length > 20 && !scrWidth900Up
                      ? classes.title_sm
                      : classes.title
                  }
                  style={titleStyle()}
                  align={scrWidth630Down ? "center" : "left"}
                >
                  {appState.activeNote ? formatTitle(title) : title}
                </Typography>
              </div>
            )}
            {appState.notes && !appState.activeNote && scrWidth600up && (
              <>
                <NoteCounter noteNumber={noteNumber} />

                <SortMenu />
              </>
            )}
            {/* RENDER A REGULAR NOTE (not TRASH) */}
            {appState.activeNote && !appState.activeNote.trash && (
              <>
                <div className={classes.icon_container}>
                  <Tooltip title="Back">
                    <IconButton
                      className={scrWidth630Down ? {} : classes.arrow}
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

                  <SelectNotebook />

                  <SelectTag />

                  <Tooltip title="Save changes">
                    <IconButton
                      color="inherit"
                      onClick={props.handleManualSave}
                    >
                      <SaveRounded />
                    </IconButton>
                  </Tooltip>

                  <Tooltip
                    title={
                      appState.activeNote.favorite
                        ? "Remove from Favorites"
                        : "Add to Favorites"
                    }
                  >
                    <IconButton onClick={noteToggleFavorite} color="inherit">
                      <StarRounded
                        style={
                          appState.activeNote.favorite ? { color: "gold" } : {}
                        }
                      />
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
                </div>
              </>
            )}
            {/* RENDER TRASHED NOTE */}
            {appState.activeNote && appState.activeNote.trash && (
              <>
                <div className={classes.icon_container}>
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

                  <Tooltip title="Restore Note">
                    <IconButton
                      aria-haspopup="true"
                      color="inherit"
                      onClick={props.restoreNote.bind(
                        this,
                        appState.activeNote
                      )}
                    >
                      <RestoreFromTrash style={{ color: "green" }} />
                    </IconButton>
                  </Tooltip>
                </div>
              </>
            )}
          </Toolbar>
        </AppBar>
      </div>
    </>
  );
};

export default MainAppBar;
