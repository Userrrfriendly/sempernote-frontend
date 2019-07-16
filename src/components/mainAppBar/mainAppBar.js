import React, { useContext, useEffect, useState } from "react";
import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";

import {
  NOTES,
  NOTEBOOK,
  FAVORITES,
  TAG,
  TRASH,
  SEARCH
} from "../../context/activeUItypes";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip
} from "@material-ui/core/";
import NoteListItem from "../noteListItem/NoteListItem";
import LinearProgress from "../loading/linearProgress";
import {
  DeleteRounded,
  StarRounded,
  Info,
  SaveRounded,
  ArrowBack
} from "@material-ui/icons";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import NoteCounter from "./noteCounter";
import SortMenu from "./sortMenu";
import { Link } from "react-router-dom";

import SelectNotebook from "./selectNotebook";
import SelectTag from "./selectTag";
import { find as _find } from "lodash";

import {
  noteFavoriteFalseReq,
  noteFavoriteTrueReq
  // trashNoteReq
} from "../../requests/requests";
import {
  NOTE_ADD_FAVORITE,
  NOTE_REMOVE_FAVORITE,
  // TRASH_NOTE,
  SET_ACTIVE_NOTE
} from "../../context/rootReducer";
import DeleteNoteDialog from "../deleteNoteDialog/deleteNoteDialog";
import RenameNoteDialog from "../noteRenameDialog/noteRenameDialog";

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
  const [displayNotes, setdisplayNotes] = useState(null);
  const [title, setTitle] = useState(null);
  const [noteNumber, setNoteNumber] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogTargetNote, setDeleteDialogTargetNote] = useState(false);
  function openDeleteDialog(note) {
    setDeleteDialogTargetNote(note);
    setDeleteDialogOpen(true);
  }

  function deleteDialogClose() {
    setDeleteDialogOpen(false);
  }

  const classes = useStyles();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  let noteListStyle = {};
  if (appState.activeNote) noteListStyle.flexBasis = "250px";
  if (smallScreen && appState.activeNote) noteListStyle.display = "none";

  const [renameNoteDialogOpen, setRenameNoteDialogOpen] = useState(false);
  const [renameDialogTargetNote, setRenameDialogTargetNote] = useState(false);
  function openRenameDialog(note) {
    setRenameDialogTargetNote(note);
    setRenameNoteDialogOpen(true);
  }

  function closeRenameDialog() {
    setRenameNoteDialogOpen(false);
  }

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
    console.log("Appbar did update");
    let notesToRender;
    switch (appState.noteFilter.name) {
      case NOTES:
        setTitle(appState.activeNote ? appState.activeNote.title : "ALL NOTES");
        setNoteNumber(appState.notes ? appState.notes.length : 0);

        notesToRender = appState.notes ? (
          appState.notes.map(note => {
            return (
              <NoteListItem
                activeNote={appState.activeNote}
                notebookName={note.notebook.name}
                notebookId={note.notebook._id}
                key={note._id}
                name={note.title}
                updated={note.updatedAt}
                created={note.createdAt}
                body={note.body}
                id={note._id}
                expandNote={props.expandNote.bind(
                  this,
                  note._id,
                  note.notebook._id
                )}
                openDeleteDialog={openDeleteDialog}
                openRenameDialog={openRenameDialog}
              />
            );
          })
        ) : (
          <LinearProgress />
        );

        setdisplayNotes(notesToRender);
        break;
      case NOTEBOOK:
        setTitle(
          'Notebook: "' +
            appState.notebooks.filter(
              notebook => notebook._id === appState.noteFilter.options
            )[0].name +
            '"'
        );
        notesToRender = appState.notes ? (
          appState.notes
            .filter(note => note.notebook._id === appState.noteFilter.options)
            .map(note => {
              return (
                <NoteListItem
                  activeNote={appState.activeNote}
                  notebookName={note.notebook.name}
                  notebookId={note.notebook._id}
                  key={note._id}
                  name={note.title}
                  updated={note.updatedAt}
                  created={note.createdAt}
                  body={note.body}
                  id={note._id}
                  expandNote={props.expandNote.bind(
                    this,
                    note._id,
                    note.notebook._id
                  )}
                  openDeleteDialog={openDeleteDialog}
                />
              );
            })
        ) : (
          <LinearProgress />
        );
        setNoteNumber(notesToRender ? notesToRender.length : 0);
        setdisplayNotes(notesToRender);
        break;
      case FAVORITES:
        setdisplayNotes("FAVORITES");
        break;
      case SEARCH:
        setdisplayNotes("SEARCH RESULTS");
        break;
      case TAG:
        setTitle(
          'Notes tagged with: "' +
            appState.tags.filter(
              tag => tag._id === appState.noteFilter.options
            )[0].tagname +
            '"'
        );
        notesToRender = appState.notes ? (
          appState.notes
            .filter(note =>
              _find(note.tags, { _id: appState.noteFilter.options })
            )
            .map(note => {
              return (
                <NoteListItem
                  activeNote={appState.activeNote}
                  notebookName={note.notebook.name}
                  notebookId={note.notebook._id}
                  key={note._id}
                  name={note.title}
                  updated={note.updatedAt}
                  created={note.createdAt}
                  body={note.body}
                  id={note._id}
                  expandNote={props.expandNote.bind(
                    this,
                    note._id,
                    note.notebook._id
                  )}
                />
              );
            })
        ) : (
          <LinearProgress />
        );
        setNoteNumber(notesToRender ? notesToRender.length : 0);
        setdisplayNotes(notesToRender);
        break;
      case TRASH:
        setTitle(
          'Notebook: "' +
            appState.notebooks.filter(
              notebook => notebook._id === appState.noteFilter.options
            )[0].name +
            '"'
        );
        notesToRender = appState.notes ? (
          appState.notes
            .filter(note => note.notebook._id === appState.noteFilter.options)
            .map(note => {
              return (
                <NoteListItem
                  activeNote={appState.activeNote}
                  notebookName={note.notebook.name}
                  notebookId={note.notebook._id}
                  key={note._id}
                  name={note.title}
                  updated={note.updatedAt}
                  created={note.createdAt}
                  body={note.body}
                  id={note._id}
                  expandNote={props.expandNote.bind(
                    this,
                    note._id,
                    note.notebook._id
                  )}
                  openDeleteDialog={openDeleteDialog}
                />
              );
            })
        ) : (
          <LinearProgress />
        );
        setNoteNumber(notesToRender ? notesToRender.length : 0);
        setdisplayNotes(notesToRender);
        break;
      default:
        throw new Error("Invalid argument in activeUI");
    }
  }, [
    appState.notes,
    appState.activeNote,
    appState.filteredNotes,
    props.expandNote,
    appState.noteFilter,
    appState.filter,
    appState.notebooks,
    appState.tags
  ]);

  return (
    <>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography
              variant="h6"
              component="h1"
              color="inherit"
              style={appState.activeNote ? { flexGrow: 1 } : {}}
            >
              {title}
            </Typography>
            {appState.notes && !appState.activeNote && (
              <>
                <NoteCounter noteNumber={noteNumber} />

                <SortMenu />
              </>
            )}

            {appState.activeNote && (
              <>
                <Tooltip title="Back">
                  <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    component={AdapterLink}
                    to="/main/"
                    onClick={() =>
                      dispatch({
                        type: SET_ACTIVE_NOTE,
                        note: null
                      })
                    }
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
                    component={AdapterLink}
                    to="/main/"
                    onClick={openDeleteDialog.bind(this, appState.activeNote)}
                  >
                    <DeleteRounded />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Toolbar>
        </AppBar>
      </div>

      <div
        // if the editor is open make max-width:250px
        // style={context.activeNote && { flexBasis: "250px" }}
        style={noteListStyle}
        className={classes.notecontainer}
      >
        {displayNotes}
      </div>
      <DeleteNoteDialog
        note={deleteDialogTargetNote}
        open={deleteDialogOpen}
        close={deleteDialogClose}
      />
      <RenameNoteDialog
        note={renameDialogTargetNote}
        open={renameNoteDialogOpen}
        close={closeRenameDialog}
      />
    </>
  );
};

export default MainAppBar;
