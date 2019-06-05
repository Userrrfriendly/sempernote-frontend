import React, {
  useContext
  // , useEffect, useState
} from "react";
import Context from "../../context/context";
import { NOTES, NOTEBOOKS, FAVORITES, TAGS } from "../../context/activeUItypes";

// import { makeStyles } from "@material-ui/core/styles";
// import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip
  // Link
  // Menu,
  // MenuItem
} from "@material-ui/core/";
import NoteListItem from "../main/NoteListItem";
import LinearProgress from "../loading/linearProgress";
import {
  DeleteRounded,
  MoreVertRounded,
  // MoreHorizRounded,
  StarRounded,
  StyleRounded,
  Info,
  LibraryBooksRounded,
  SaveRounded,
  ArrowBack
} from "@material-ui/icons";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import NoteCounter from "./noteCounter";
import SortMenu from "./sortMenu";
import { Link } from "react-router-dom";

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
  },
  notecount: {
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
 * 
 -By clicking on the sidenav.icon an action is dispatched that changes the state of context
 -When the state the context is modified Noteheader will rerender with the correct UI
  {activeUI:"NOTES"} //all notes
  {activeUI:"NOTEBOOKS"} //all notebooks
  {activeUI:"FAVORITES"} //FAVORITES
  {activeUI:"TAG"} // TAGs
  {activeUI:"SINGLE_NOTE"} // Single Note  
  {activeUI:"SINGLE_TAG"} //One TAG
  {activeUI:"SINGLE_NOTEBOOK"},{activeNotebook:notebookID} //One notebook
  {activeUI:"SEARCH"},{searchResults:[notebook,tag,note]} // search
 <--Proposed Solution: both SideNav & NoteHeader subscribe to the context and do whatever they please
 all functionality will still be dumped into App.js 
 -->

  */

// required for react-router-dom < 6.0.0
// see https://github.com/ReactTraining/react-router/issues/6056#issuecomment-435524678
const AdapterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} {...props} />
));

//Its is a legit option to render two different components one for mobile and one for desktop
const MainAppBar = props => {
  // let [activeUI, setActiveUI] = useState(null);
  // const [title, setTitle] = useState(null);

  const classes = useStyles();
  const context = useContext(Context);
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  let noteListStyle = {};
  if (context.activeNote) noteListStyle.flexBasis = "250px";
  if (smallScreen && context.activeNote) noteListStyle.display = "none";

  let activeUI = "";
  let title;

  // useEffect(() => {
  //   console.log("Appbar did update");
  switch (context.activeUI) {
    case NOTES:
      // setTitle(context.activeNote ? context.activeNote.title : "ALL NOTES");
      title = context.activeNote ? context.activeNote.title : "ALL NOTES";
      activeUI = context.notes ? (
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
      break;
    case NOTEBOOKS:
      activeUI = "NOTEBOOKS";
      break;
    case FAVORITES:
      activeUI = "FAVORITES";
      break;
    case TAGS:
      activeUI = "TAGS";
      break;
    default:
      throw new Error("Invalid argument in activeUI");
  }

  // }, [context.notes, context.activeNote, context.activeUI, props.expandNote]);

  // function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   setAuth(event.target.checked);
  // }

  // function handleMenu(event: React.MouseEvent<HTMLElement>) {
  //   setAnchorEl(event.currentTarget);
  // }

  // function handleClose() {
  //   setAnchorEl(null);
  // }

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
                <NoteCounter>
                  {context.notes ? context.notes.length : ""}
                </NoteCounter>
                <Typography
                  variant="subtitle1"
                  component="span"
                  display="block"
                  color="inherit"
                  className={classes.notecount}
                >
                  {context.notes && context.notes.length > 1
                    ? " notes"
                    : " note"}
                </Typography>

                <SortMenu
                  notes={context.notes}
                  updateNotes={context.updateNotes}
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
                <Tooltip title="Change Notebook">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    // onClick={handleMenu}
                    color="inherit"
                  >
                    <LibraryBooksRounded />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Tags">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    // onClick={handleMenu}
                    color="inherit"
                  >
                    <StyleRounded />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Favorites">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    // onClick={handleMenu}
                    color="inherit"
                  >
                    <StarRounded />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Note info">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    // onClick={handleMenu}
                    color="inherit"
                  >
                    <Info />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Note">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    // onClick={handleMenu}
                    color="inherit"
                    // onClick={handleMenu}
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

                <Tooltip title="Settings">
                  <IconButton
                    // aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    // onClick={handleMenu}
                    color="inherit"
                  >
                    <MoreVertRounded />
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
        {activeUI}
      </div>
    </>
  );
};

export default MainAppBar;
