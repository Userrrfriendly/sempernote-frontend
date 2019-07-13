import React, { useEffect, useState, useContext } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

// import Context from "../../context/context";
import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";
import { SET_ACTIVE_NOTE, UPDATE_NOTE_BODY } from "../../context/rootReducer";
import { updateNoteBodyReq } from "../../requests/requests";

// import "./main.css";
import ExpandedNote from "../editor/expandedNote";
import NotebookModal from "../createNotebookModal/notebookModal";
import NoteModal from "../createNoteModal/noteModal";
import TagModal from "../createTagModal/tagModal";
import SideNav from "../sideNav/sidenav";
import Fab from "../fab/fab";

import { Hidden } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import MainAppBar from "../mainAppBar/mainAppBar";
import Paper from "../paper/paper";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  main_section: {
    backgroundColor: "#fff",
    width: "100%",
    minHeight: "calc(100vh - 3rem)",
    /* display: flex; */
    flexFlow: "column",
    overflow: "hidden",
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  main_subcontainer: {
    /* width: 100%;
    display: flex; */
    width: "60%",
    maxWidth: "100%",
    flexGrow: "1"
  }
}));

const Main = props => {
  const [noteModal, setNoteModal] = useState(false);
  const [notebookModal, setNotebookModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const theme = useTheme();
  const classes = useStyles();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  // const context = useContext(Context);
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  /**NOTEBOOK Modal */
  const openCreateNotebookModal = () => {
    setNotebookModal(true);
  };

  const closeCreateNotebookModal = () => {
    setNotebookModal(false);
  };

  /**NOTE Modal */
  const openCreateNoteModal = () => {
    setNoteModal(true);
  };

  const closenoteModal = () => {
    setNoteModal(false);
  };

  /**TAG Modal */
  const openCreateTagModal = () => {
    setTagModal(true);
  };

  const closeCreateTagModal = () => {
    setTagModal(false);
  };

  const expandNote = (noteId, notebookId) => {
    console.log(
      `note with ID ${noteId} and notebookID: ${notebookId} expanded`
    );
    // context.setActiveNote(noteId);
    dispatch({
      type: SET_ACTIVE_NOTE,
      _id: noteId
    });

    let path = `/main/editor`;
    props.history.push(path);
  };

  //Update noteBody - defined here because and passed as props to <ExpandedNote/> is a classBased component
  const updateNoteBody = (noteId, currentDelta) => {
    updateNoteBodyReq(noteId, currentDelta, appState.token).then(res => {
      dispatch({
        type: UPDATE_NOTE_BODY,
        note: res
      });
    });
  };

  useEffect(() => {
    console.log("useEffect triggered in <MAIN>");
    //when the user presses the back button the activeNote is set to null thus hidding the editor
    //probably will need more solid logic in the future but this will do for now

    window.onpopstate = e => {
      //onpopstate detects if the back/forward button was pressed
      // console.log(props.location.pathname);
      if (props.history.location.pathname === "/main/" && appState.activeNote) {
        dispatch({
          type: SET_ACTIVE_NOTE,
          _id: null
        });
      }
      console.log("back button was pressed");
    };
  }, [props.history.location.pathname, appState.activeNote, dispatch]);

  // console.log(matches);
  return (
    <main
      className={classes.main_section}
      // className="main-section"
      // style={{
      //   direction: "row",
      //   justifyContent: "flex-start",
      //   alignItems: "flex-start"
      // }}
    >
      <Hidden mdDown>
        <SideNav
          openCreateNoteModal={openCreateNoteModal}
          openCreateNotebookModal={openCreateNotebookModal}
          openCreateTagModal={openCreateTagModal}
        />
      </Hidden>

      <Paper style={matches ? { marginLeft: 0 } : { marginLeft: "60px" }}>
        <MainAppBar expandNote={expandNote} />
        <Route
          exact
          path="/main/"
          render={props => (
            <Fab
              createNote={openCreateNoteModal}
              createNotebook={openCreateNotebookModal}
              createTag={openCreateTagModal}
            />
          )}
        />
        <div
          className={classes.main_subcontainer}
          // className="main-subcontainer"
        >
          <Switch>
            <Route
              exact
              path="/main/editor/"
              render={props => (
                <>
                  {appState.activeNote && (
                    <ExpandedNote
                      note={appState.activeNote}
                      updateNoteBody={updateNoteBody}
                    />
                  )}
                </>
              )}
            />
          </Switch>
        </div>
        {appState.notebooks && (
          <>
            <NotebookModal
              notebooks={appState.notebooks}
              token={appState.token}
              openModal={openCreateNotebookModal}
              closeModal={closeCreateNotebookModal}
              isOpen={notebookModal}
            />

            <NoteModal
              notes={appState.notes}
              notebooks={appState.notebooks}
              pushNoteToServer={appState.pushNoteToServer}
              openModal={openCreateNoteModal}
              closeModal={closenoteModal}
              isOpen={noteModal}
              token={appState.token}
            />
            <TagModal
              tags={appState.tags}
              token={appState.token}
              openModal={openCreateTagModal}
              closeModal={closeCreateTagModal}
              isOpen={tagModal}
            />
          </>
        )}
      </Paper>
    </main>
  );
};

export default withRouter(Main);
