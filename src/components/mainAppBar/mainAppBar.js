import React, { useContext, useEffect, useState } from "react";
import Context from "../../context/context";
import {
  NOTES,
  NOTEBOOK,
  FAVORITES,
  TAG,
  TRASH,
  SEARCH
} from "../../context/activeUItypes";

// import { makeStyles } from "@material-ui/core/styles";
// import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip
} from "@material-ui/core/";
import NoteListItem from "../main/NoteListItem";
import LinearProgress from "../loading/linearProgress";
import {
  DeleteRounded,
  // MoreVertRounded,
  // MoreHorizRounded,
  // LibraryBooksRounded,
  // StyleRounded,
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

/** All these are modified by clicking on the sidenav
 * Notes
 * Notebooks
 * ActiveNotebook
 * Tags
 * Search
 * Favorites

  */

// required for react-router-dom < 6.0.0
// see https://github.com/ReactTraining/react-router/issues/6056#issuecomment-435524678
const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

const MainAppBar = props => {
  const [displayNotes, setdisplayNotes] = useState(null);
  const [title, setTitle] = useState(null);
  const [noteNumber, setNoteNumber] = useState(null);

  const classes = useStyles();
  const context = useContext(Context);
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  let noteListStyle = {};
  if (context.activeNote) noteListStyle.flexBasis = "250px";
  if (smallScreen && context.activeNote) noteListStyle.display = "none";

  useEffect(() => {
    console.log("Appbar did update");
    console.log(context.noteFilter.name);
    let notesToRender;
    switch (context.noteFilter.name) {
      case NOTES:
        setTitle(context.activeNote ? context.activeNote.title : "ALL NOTES");
        setNoteNumber(context.notes ? context.notes.length : 0);

        notesToRender = context.notes ? (
          context.notes.map(note => {
            return (
              <NoteListItem
                activeNote={context.activeNote}
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
            context.notebooks.filter(
              notebook => notebook._id === context.noteFilter.options
            )[0].name +
            '"'
        );
        notesToRender = context.notes ? (
          context.notes
            .filter(note => note.notebook._id === context.noteFilter.options)
            .map(note => {
              return (
                <NoteListItem
                  activeNote={context.activeNote}
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
        console.log(context.noteFilter);
        console.log(notesToRender);
        setNoteNumber(notesToRender ? notesToRender.length : 0);
        setdisplayNotes(notesToRender);
        // setActiveUI("NOTEBOOKS");
        break;
      case FAVORITES:
        setdisplayNotes("FAVORITES");
        // setActiveUI("FAVORITES");
        break;
      case SEARCH:
        setdisplayNotes("SEARCH RESULTS");
        // setActiveUI("FAVORITES");
        break;
      case TAG:
        setTitle(
          'Notes tagged with: "' +
            context.tags.filter(
              tag => tag._id === context.noteFilter.options
            )[0].tagname +
            '"'
        );
        notesToRender = context.notes ? (
          context.notes
            .filter(note =>
              _find(note.tags, { _id: context.noteFilter.options })
            )
            .map(note => {
              return (
                <NoteListItem
                  activeNote={context.activeNote}
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
        console.log(context.noteFilter);
        // console.log(notesToRender);
        setNoteNumber(notesToRender ? notesToRender.length : 0);
        setdisplayNotes(notesToRender);
        break;
      case TRASH:
        setTitle(
          'Notebook: "' +
            context.notebooks.filter(
              notebook => notebook._id === context.noteFilter.options
            )[0].name +
            '"'
        );
        notesToRender = context.notes ? (
          context.notes
            .filter(note => note.notebook._id === context.noteFilter.options)
            .map(note => {
              return (
                <NoteListItem
                  activeNote={context.activeNote}
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
        console.log(context.noteFilter);
        console.log(notesToRender);
        setNoteNumber(notesToRender ? notesToRender.length : 0);
        setdisplayNotes(notesToRender);
        // setActiveUI("NOTEBOOKS");
        break;
      default:
        throw new Error("Invalid argument in activeUI");
    }
  }, [
    context.notes,
    context.activeNote,
    context.filteredNotes,
    props.expandNote,
    context.noteFilter,
    context.filter,
    context.notebooks,
    context.tags
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
              style={context.activeNote ? { flexGrow: 1 } : {}}
            >
              {title}
            </Typography>
            {context.notes && !context.activeNote && (
              <>
                <NoteCounter noteNumber={noteNumber} />

                <SortMenu
                  notes={context.notes}
                  filteredNotes={context.filteredNotes}
                  updateNotes={context.updateNotes}
                  setFilteredNotes={context.setFilteredNotes}
                />
              </>
            )}

            {context.activeNote && (
              <>
                <Tooltip title="Back">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    // onClick={handleMenu}
                    color="inherit"
                    component={AdapterLink}
                    to="/main/"
                    onClick={context.setActiveNote}
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

                <SelectNotebook
                  activeNote={context.activeNote}
                  notebooks={context.notebooks}
                  moveNoteToNotebook={context.moveNoteToNotebook}
                />

                <SelectTag
                  activeNote={context.activeNote}
                  notebooks={context.notebooks}
                  tags={context.tags}
                  assignTag={context.assignTag}
                  unAssignTag={context.unAssignTag}
                />

                <Tooltip title="Favorites">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    onClick={context.noteToggleFavorite.bind(
                      this,
                      context.activeNote
                    )}
                    color="inherit"
                  >
                    <StarRounded
                      style={
                        context.activeNote.favorite ? { color: "gold" } : {}
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
                    onClick={context.softDeleteNote.bind(
                      this,
                      context.activeNote
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
