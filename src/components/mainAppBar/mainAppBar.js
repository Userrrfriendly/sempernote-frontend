import React, { useContext, useEffect, useState } from "react";
// import Context from "../../context/context";
// import DispatchContext from "../../context/DispatchContext";
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

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    marginBottom: "1rem",
    width: "100%"
    // overflow: "hidden"
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
  const [displayNotes, setdisplayNotes] = useState(null);
  const [title, setTitle] = useState(null);
  const [noteNumber, setNoteNumber] = useState(null);
  const appState = useContext(StateContext);
  // const dispatch = useContext(DispatchContext);

  const classes = useStyles();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  let noteListStyle = {};
  if (appState.activeNote) noteListStyle.flexBasis = "250px";
  if (smallScreen && appState.activeNote) noteListStyle.display = "none";

  useEffect(() => {
    console.log("Appbar did update");
    console.log(appState.noteFilter.name);
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
              />
            );
          })
        ) : (
          <LinearProgress />
        );

        // console.log(notesToRender);
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
                />
              );
            })
        ) : (
          <LinearProgress />
        );
        console.log(appState.noteFilter);
        console.log(notesToRender);
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
        console.log(appState.noteFilter);
        // console.log(notesToRender);
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
                />
              );
            })
        ) : (
          <LinearProgress />
        );
        console.log(appState.noteFilter);
        console.log(notesToRender);
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
              // className={classes.title}
              style={appState.activeNote ? { flexGrow: 1 } : {}}
            >
              {title}
            </Typography>
            {appState.notes && !appState.activeNote && (
              <>
                <NoteCounter noteNumber={noteNumber} />

                <SortMenu
                // notes={appState.notes}
                // filteredNotes={appState.filteredNotes}
                // updateNotes={appState.updateNotes}
                // setFilteredNotes={appState.setFilteredNotes}
                />
              </>
            )}

            {appState.activeNote && (
              <>
                <Tooltip title="Back">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    // onClick={handleMenu}
                    color="inherit"
                    component={AdapterLink}
                    to="/main/"
                    onClick={appState.setActiveNote}
                  >
                    {/* <Link component={RouterLink} to="/main/"> */}
                    <ArrowBack />
                    {/* </Link> */}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Save changes">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    // onClick={handleMenu}
                    color="inherit"
                  >
                    <SaveRounded />
                  </IconButton>
                </Tooltip>

                <SelectNotebook />

                <SelectTag
                // activeNote={appState.activeNote}
                // notebooks={appState.notebooks}
                // tags={appState.tags}
                // assignTag={appState.assignTag}
                // unAssignTag={appState.unAssignTag}
                />

                <Tooltip title="Favorites">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    onClick={appState.noteToggleFavorite.bind(
                      this,
                      appState.activeNote
                    )}
                    color="inherit"
                  >
                    <StarRounded
                      style={
                        appState.activeNote.favorite ? { color: "gold" } : {}
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Note info">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <Info />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Note">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    color="inherit"
                    component={AdapterLink}
                    to="/main/"
                    onClick={appState.softDeleteNote.bind(
                      this,
                      appState.activeNote
                    )}
                  >
                    <DeleteRounded />
                  </IconButton>
                </Tooltip>

                {/* <Tooltip title="Settings">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    // onClick={handleMenu}
                    color="inherit"
                  >
                    <MoreVertRounded />
                  </IconButton>
                </Tooltip> */}
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
    </>
  );
};

export default MainAppBar;
