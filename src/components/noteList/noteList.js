import React, { useState, useEffect, useContext } from "react";
import { NOTES, NOTEBOOK, TAG, TRASH } from "../../context/activeUItypes";
import StateContext from "../../context/StateContext";
import NoteListItem from "../noteListItem/NoteListItem";
import LinearProgress from "../loading/linearProgress";
import { find as _find } from "lodash";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, useTheme } from "@material-ui/core/styles";

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

const NoteList = props => {
  const [displayNotes, setdisplayNotes] = useState([]);
  const appState = useContext(StateContext);
  const classes = useStyles();
  const theme = useTheme();

  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  let noteListStyle = {};
  if (appState.activeNote) noteListStyle.flexBasis = "250px";
  if (smallScreen && appState.activeNote) noteListStyle.display = "none";

  useEffect(() => {
    console.log("NoteList did update");
    let notesToRender;

    switch (appState.noteFilter.name) {
      case NOTES:
        notesToRender = appState.notes;
        break;
      case NOTEBOOK:
        notesToRender = appState.notes
          ? appState.notes
              .filter(note => note.notebook._id === appState.noteFilter.options)
              .map(note => note)
          : null;
        break;
      case TAG:
        notesToRender = appState.notes
          ? appState.notes
              .filter(note =>
                _find(note.tags, { _id: appState.noteFilter.options })
              )
              .map(note => note)
          : null;
        break;
      case TRASH:
        notesToRender = appState.notes
          ? appState.notes
              .filter(note => note.notebook._id === appState.noteFilter.options)
              .map(note => note)
          : null;
        break;
      default:
        throw new Error("Invalid argument in activeUI");
    }
    setdisplayNotes(notesToRender);
  }, [
    appState.notes,
    appState.activeNote,
    appState.noteFilter,
    appState.notebooks,
    appState.tags
  ]);

  return (
    <div
      // if the editor is open make max-width:250px
      // style={context.activeNote && { flexBasis: "250px" }}
      style={noteListStyle}
      className={classes.notecontainer}
    >
      {displayNotes ? (
        displayNotes.map(note => {
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
              openDeleteDialog={props.openDeleteDialog}
              openRenameDialog={props.openRenameDialog}
            />
          );
        })
      ) : (
        <LinearProgress />
      )}
    </div>
  );
};

export default NoteList;
