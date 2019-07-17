import React, { useEffect, useState, useContext } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";
import { SET_ACTIVE_NOTE, UPDATE_NOTE_BODY } from "../../context/rootReducer";
import { updateNoteBodyReq } from "../../requests/requests";

import ExpandedNote from "../editor/expandedNote";
import CreateNotebookModal from "../createNotebookModal/createNotebookModal";
import CreateNoteModal from "../createNoteModal/createNoteModal";
import CreateTagModal from "../createTagModal/createTagModal";
import SideNav from "../sideNav/sidenav";
import Fab from "../fab/fab";

import { Hidden } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import MainAppBar from "../mainAppBar/mainAppBar";
import Paper from "../paper/paper";
import { makeStyles } from "@material-ui/core/styles";
import DeleteNoteDialog from "../deleteNoteDialog/deleteNoteDialog";
import RenameNoteDialog from "../noteRenameDialog/noteRenameDialog";
import NoteList from "../noteList/noteList";

const useStyles = makeStyles(theme => ({
  main_section: {
    backgroundColor: "#fff",
    width: "100%",
    minHeight: "calc(100vh - 3rem)",
    flexFlow: "column",
    overflow: "hidden",
    direction: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  main_subcontainer: {
    width: "60%",
    maxWidth: "100%",
    flexGrow: "1"
  }
}));

const Main = props => {
  const [noteModal, setNoteModal] = useState(false);
  const [notebookModal, setNotebookModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const theme = useTheme();
  const classes = useStyles();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  /**DELETE/RENAME NOTE DIALOGS */
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogTargetNote, setDeleteDialogTargetNote] = useState(false);
  function openDeleteDialog(note) {
    setDeleteDialogTargetNote(note);
    setDeleteDialogOpen(true);
  }
  function deleteDialogClose() {
    setDeleteDialogOpen(false);
  }

  const [renameNoteDialogOpen, setRenameNoteDialogOpen] = useState(false);
  const [renameDialogTargetNote, setRenameDialogTargetNote] = useState(false);
  function openRenameDialog(note) {
    setRenameDialogTargetNote(note);
    setRenameNoteDialogOpen(true);
  }
  function closeRenameDialog() {
    setRenameNoteDialogOpen(false);
  }

  /**SIDENAV DRAWERS */
  const [drawerState, setDrawerState] = useState({
    tags: false,
    favorites: false,
    notebooks: false,
    trash: false,
    search: false
  });

  const toggleDrawer = (drawer, open) => {
    if (!drawer) {
      //close all drawers
      setDrawerState({
        tags: false,
        favorites: false,
        notebooks: false,
        trash: false,
        search: false
      });
    } else {
      //close all open drawers and open the one that was targeted
      setDrawerState({
        tags: false,
        favorites: false,
        notebooks: false,
        trash: false,
        search: false,
        [drawer]: open
      });
    }
  };

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
    dispatch({
      type: SET_ACTIVE_NOTE,
      _id: noteId
    });

    let path = `/main/editor`;
    props.history.push(path);
  };

  //Update noteBody - defined here, and passed as props to <ExpandedNote/>  which is a class component and cant use hooks
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
    window.onpopstate = e => {
      //onpopstate detects if the back/forward button was pressed
      if (props.history.location.pathname === "/main/" && appState.activeNote) {
        dispatch({
          type: SET_ACTIVE_NOTE,
          _id: null
        });
      }
      console.log("back button was pressed");
    };
  }, [props.history.location.pathname, appState.activeNote, dispatch]);

  return (
    <main className={classes.main_section}>
      <Hidden mdDown>
        <SideNav
          openCreateNoteModal={openCreateNoteModal}
          openCreateNotebookModal={openCreateNotebookModal}
          openCreateTagModal={openCreateTagModal}
          drawerState={drawerState}
          toggleDrawer={toggleDrawer}
        />
      </Hidden>

      <Paper style={matches ? { marginLeft: 0 } : { marginLeft: "60px" }}>
        <MainAppBar
          expandNote={expandNote}
          openDeleteDialog={openDeleteDialog}
          openRenameDialog={openRenameDialog}
        />
        <NoteList
          openDeleteDialog={openDeleteDialog}
          openRenameDialog={openRenameDialog}
          expandNote={expandNote}
        />
        <Route
          exact
          path="/main/"
          render={props => (
            <Fab
              createNote={openCreateNoteModal}
              createNotebook={openCreateNotebookModal}
              createTag={openCreateTagModal}
              toggleDrawer={toggleDrawer}
            />
          )}
        />
        <div className={classes.main_subcontainer}>
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
        {appState.notebooks && (
          <>
            <CreateNotebookModal
              notebooks={appState.notebooks}
              token={appState.token}
              openModal={openCreateNotebookModal}
              closeModal={closeCreateNotebookModal}
              isOpen={notebookModal}
            />

            <CreateNoteModal
              notes={appState.notes}
              notebooks={appState.notebooks}
              pushNoteToServer={appState.pushNoteToServer}
              openModal={openCreateNoteModal}
              closeModal={closenoteModal}
              isOpen={noteModal}
              token={appState.token}
            />
            <CreateTagModal
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
