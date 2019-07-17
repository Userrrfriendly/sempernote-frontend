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
  Tooltip
} from "@material-ui/core/";
import {
  DeleteRounded,
  StarRounded,
  Info,
  SaveRounded,
  ArrowBack
} from "@material-ui/icons";
import NoteCounter from "./noteCounter";
import SortMenu from "./sortMenu";
import SelectNotebook from "./selectNotebook";
import SelectTag from "./selectTag";
import { find as _find } from "lodash";
import {
  noteFavoriteFalseReq,
  noteFavoriteTrueReq
} from "../../requests/requests";
import {
  NOTE_ADD_FAVORITE,
  NOTE_REMOVE_FAVORITE,
  SET_ACTIVE_NOTE
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
  const [title, setTitle] = useState(null);
  const [noteNumber, setNoteNumber] = useState(null);
  const classes = useStyles();

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

    switch (appState.noteFilter.name) {
      case NOTES:
        setTitle(appState.activeNote ? appState.activeNote.title : "ALL NOTES");
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
              .filter(note => note.notebook._id === appState.noteFilter.options)
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
  }, [
    appState.notes,
    appState.activeNote,
    appState.noteFilter,
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
          </Toolbar>
        </AppBar>
      </div>
    </>
  );
};

export default MainAppBar;
