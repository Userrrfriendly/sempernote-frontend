import React, { useContext } from "react";
import Context from "../../context/context";
import { NOTES, NOTEBOOKS, FAVORITES, TAGS } from "../../context/activeUItypes";

// import { makeStyles } from "@material-ui/core/styles";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core/";
import NoteListItem from "../main/NoteListItem";
// import LoadingBlocks from "../loading/loadingBlocks";
import LinearProgress from "../loading/linearProgress";
import {
  DeleteRounded,
  MoreVertRounded,
  MoreHorizRounded,
  StarRounded,
  StyleRounded,
  Info,
  LibraryBooksRounded,
  SaveRounded,
  SortByAlpha
} from "@material-ui/icons";

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       flexGrow: 1,
//       marginBottom: "1rem",
//       width: "100%"
//     },
//     notecontainer: {
//       overflowY: "scroll",
//       maxHeight: "calc(100vh - 98px)"
//     },
//     title: {
//       flexGrow: 1
//     }
//   })
// );

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    marginBottom: "1rem",
    width: "100%"
  },
  notecontainer: {
    overflowY: "scroll",
    maxHeight: "calc(100vh - 98px)"
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

//Its is a legit option to render two different components one for mobile and one for desktop
const MainAppBar = props => {
  const classes = useStyles();
  const context = useContext(Context);
  // console.log(context.activeUI);
  let activeUI = "";
  let title;
  switch (context.activeUI) {
    case NOTES:
      title = context.activeNote ? context.activeNote.title : "ALL NOTES";
      activeUI = context.notes ? (
        context.notes.map(note => {
          return (
            <NoteListItem
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
        <LinearProgress width={{ width: "100vw" }} />
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

  // function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   setAuth(event.target.checked);
  // }

  // function handleMenu(event: React.MouseEvent<HTMLElement>) {
  //   setAnchorEl(event.currentTarget);
  // }

  // function handleClose() {
  //   setAnchorEl(null);
  // }

  console.log(context.notes);
  return (
    <>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography
              variant="h6"
              component="h1"
              color="inherit"
              className={classes.title}
            >
              {title}
            </Typography>
            <Typography
              variant="subtitle1"
              component="span"
              display="block"
              color="inherit"
            >
              {context.notes ? context.notes.length + " notes" : ""}
            </Typography>
            <IconButton
              // aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              // onClick={handleMenu}
              color="inherit"
              edge="start"
            >
              <SaveRounded />
            </IconButton>
            <IconButton
              // aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              // onClick={handleMenu}
              color="inherit"
              edge="start"
            >
              <LibraryBooksRounded />
            </IconButton>
            {/*  */}
            <IconButton
              // aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              // onClick={handleMenu}
              color="inherit"
              edge="start"
            >
              <StyleRounded />
            </IconButton>{" "}
            <IconButton
              // aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              // onClick={handleMenu}
              color="inherit"
              edge="start"
            >
              <StarRounded />
            </IconButton>
            <IconButton
              // aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              // onClick={handleMenu}
              color="inherit"
              edge="start"
            >
              <Info />
            </IconButton>
            <IconButton
              // aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              // onClick={handleMenu}
              color="inherit"
              edge="start"
            >
              <DeleteRounded />
            </IconButton>
            <IconButton
              // aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              // onClick={handleMenu}
              color="inherit"
              edge="start"
            >
              <SortByAlpha />
            </IconButton>
            <IconButton
              // aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              // onClick={handleMenu}
              color="inherit"
              edge="start"
            >
              <MoreVertRounded />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      {/* {!context.activeNote && (
        <div className={classes.notecontainer}>{activeUI}</div>
      )} */}
      <div
        // if the editor is open make max-width:250px
        style={context.activeNote && { flexBasis: "250px" }}
        className={classes.notecontainer}
      >
        {activeUI}
      </div>
    </>
  );
};

export default MainAppBar;
