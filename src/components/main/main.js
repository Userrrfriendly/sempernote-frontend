import React, { useEffect, useState, useContext } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";
import {
  SET_ACTIVE_NOTE,
  UPDATE_NOTE_BODY,
  RESTORE_NOTE
} from "../../context/rootReducer";
import { updateNoteBodyReq, restoreNoteReq } from "../../requests/requests";

import ExpandedNote from "../editor/expandedNote";
import CreateNotebookModal from "../createNotebookModal/createNotebookModal";
import CreateNoteModal from "../createNoteModal/createNoteModal";
import CreateTagModal from "../createTagModal/createTagModal";
import SideNav from "../sideNav/sidenav";
import Fab from "../fab/fab";

import { Drawer } from "@material-ui/core";
import MainAppBar from "../mainAppBar/mainAppBar";
import Paper from "../paper/paper";
import DeleteNoteDialog from "../deleteNoteDialog/deleteNoteDialog";
import RenameNoteDialog from "../noteRenameDialog/noteRenameDialog";
import NoteList from "../noteList/noteList";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useScreenWidth } from "../../helpers/customHooks/useScreenWidth";
import { useScreenHeight } from "../../helpers/customHooks/useScreenHeight";

const Main = props => {
  const scrWidth600up = useScreenWidth();
  const scrHeight600up = useScreenHeight();

  const [mobileOpen, setMobileOpen] = React.useState(false); //Sidenav Drawer on small screens

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const { container } = props;
  const drawerWidth = scrWidth600up && scrHeight600up ? 60 : 240;

  const useStyles = makeStyles(theme => ({
    root: {
      display: "flex"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      flexGrow: 1,
      marginBottom: "1rem",
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`
      },
      maxWidth: "calc(100vw - 16px)"
      //shrink Appbar for the small screens so it wont overflow (16px = <Paper>'s padding left,right)
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      zIndex: 1301 //raise it above the secondary drawers
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
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
    },
    temp_drawer: {
      color: "black"
    },
    perm_drawer: {
      color: "black"
    }
  }));

  const [noteModal, setNoteModal] = useState(false);
  const [notebookModal, setNotebookModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [manualSave, setManualSave] = useState(false);
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const theme = useTheme();
  const classes = useStyles();

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
    if (!scrWidth600up || !scrHeight600up) setMobileOpen(false); //if in small screen close the main drawer
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

  const restoreNote = note => {
    restoreNoteReq(note, appState.token).then(r => console.log(r));
    dispatch({
      type: RESTORE_NOTE,
      note: note
    });
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

  /** manualSave is passed as props to ExpandedNote if it is true it will:
   * trigger autosave.flush()
   * trigger manualSaveDisable()
   ** handleManualSave is passed to MainAppBar and is triggered when the user presses the <Save> icon */
  const handleManualSave = () => {
    setManualSave(true);
  };

  const manualSaveDisable = () => {
    setManualSave(false);
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
    };
  }, [props.history.location.pathname, appState.activeNote, dispatch]);

  return (
    <main className={classes.main_section}>
      <nav className={classes.drawer} aria-label="navigation">
        {(!scrWidth600up || !scrHeight600up) && (
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
            className={classes.temp_drawer}
          >
            <SideNav
              openCreateNoteModal={openCreateNoteModal}
              openCreateNotebookModal={openCreateNotebookModal}
              openCreateTagModal={openCreateTagModal}
              drawerState={drawerState}
              toggleDrawer={toggleDrawer}
              restoreNote={restoreNote}
              openDeleteDialog={openDeleteDialog}
            />
          </Drawer>
        )}
        {scrWidth600up && scrHeight600up && (
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
            className={classes.perm_drawer}
          >
            <SideNav
              openCreateNoteModal={openCreateNoteModal}
              openCreateNotebookModal={openCreateNotebookModal}
              openCreateTagModal={openCreateTagModal}
              drawerState={drawerState}
              toggleDrawer={toggleDrawer}
              restoreNote={restoreNote}
              openDeleteDialog={openDeleteDialog}
            />
          </Drawer>
        )}
      </nav>

      <Paper>
        <MainAppBar
          expandNote={expandNote}
          openDeleteDialog={openDeleteDialog}
          openRenameDialog={openRenameDialog}
          restoreNote={restoreNote}
          handleManualSave={handleManualSave}
          handleDrawerToggle={handleDrawerToggle}
          classes={classes}
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
                      manualSave={manualSave}
                      manualSaveDisable={manualSaveDisable}
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
