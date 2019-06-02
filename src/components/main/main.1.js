import React, { useEffect, useState, useContext } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import Context from "../../context/context";

import "./main.css";
import ExpandedNote from "../editor/expandedNote";
import NotebookModal from "../createNotebookModal/notebookModal";
import NoteModal from "../createNoteModal/noteModal";
import SideNav from "../sideNav/sidenav";
import { Hidden, Grid } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Fab from "../fab/fab";
import MainAppBar from "../mainAppBar/mainAppBar";
import Paper from "../paper/paper";

const Main = props => {
  const [noteModal, setNoteModal] = useState(false);
  const [notebookModal, setNotebookModal] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const context = useContext(Context);

  /**NOTEBOOK Modal */
  const openCreateNotebookModal = () => {
    setNotebookModal(true);
  };

  const closeCreateNotebookModal = () => {
    setNotebookModal(false);
  };

  /**NOTE Modal */
  const opennoteModal = () => {
    setNoteModal(true);
  };

  const closenoteModal = () => {
    setNoteModal(false);
  };

  const expandNote = (noteId, notebookId) => {
    console.log(
      `note with ID ${noteId} and notebookID: ${notebookId} expanded`
    );
    context.setActiveNotebook(notebookId);
    context.setActiveNote(noteId);
    let path = `/main/editor`;
    props.history.push(path);
  };

  //Simulates componentDidUpdate lifecycle
  useEffect(() => {
    console.log("useEffect triggered in <MAIN>");
    //when the user presses the back button the activeNote is set to null thus hidding the editor
    //probably will need more solid logic in the future but this will do for now

    window.onpopstate = e => {
      //onpopstate detects if the back/forward button was pressed
      if (props.location.pathname === "/main/" && context.activeNote) {
        context.setActiveNote(null);
      }
      console.log("back button was pressed");
    };
    //context was added as a second dependancy only because react was throwing a warning... can it cause problems later?
  }, [props.location.pathname, context]);

  // console.log(matches);
  return (
    <main className="main-section l10">
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item>
          <Hidden mdDown>
            <SideNav />
          </Hidden>
        </Grid>
        <Grid
          className="brockengrid"
          item
          style={matches ? { marginLeft: 0 } : { marginLeft: "60px" }}
        >
          <Paper>
            <MainAppBar expandNote={expandNote} />
            <Route
              exact
              path="/main/"
              render={props => (
                <Fab
                  createNote={opennoteModal}
                  createNoteBook={openCreateNotebookModal}
                />
              )}
            />
            <div className="main-subcontainer">
              <Switch>
                <Route
                  exact
                  path="/main/editor/"
                  render={props => (
                    <>
                      {context.activeNote && (
                        <ExpandedNote
                          note={context.activeNote}
                          updateNoteBody={context.updateNoteBody}
                        />
                      )}
                    </>
                  )}
                />
              </Switch>
            </div>
            {/* whats the point of conditional rendering? ther will always be at least one notebook(hopefully) */}
            {context.notebooks && (
              <>
                <NotebookModal
                  notebooks={context.notebooks}
                  createNotebook={context.createNotebook}
                  openModal={openCreateNotebookModal}
                  closeModal={closeCreateNotebookModal}
                  isOpen={notebookModal}
                />

                <NoteModal
                  notes={context.notes}
                  notebooks={context.notebooks}
                  pushNoteToServer={context.pushNoteToServer}
                  openModal={opennoteModal}
                  closeModal={closenoteModal}
                  isOpen={noteModal}
                  pushNoteToState={context.pushNoteToState}
                  setActiveNote={context.setActiveNote}
                />
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
};

export default withRouter(Main);
