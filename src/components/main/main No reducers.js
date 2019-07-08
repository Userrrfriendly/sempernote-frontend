import React, { useEffect, useState, useContext } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import Context from "../../context/context";

import "./main.css";
import ExpandedNote from "../editor/expandedNote";
import NotebookModal from "../createNotebookModal/notebookModal";
import NoteModal from "../createNoteModal/noteModal";
import TagModal from "../createTagModal/tagModal";
import SideNav from "../sideNav/sidenav";
import { Hidden } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Fab from "../fab/fab";
import MainAppBar from "../mainAppBar/mainAppBar";
import Paper from "../paper/paper";

const Main = props => {
  const [noteModal, setNoteModal] = useState(false);
  const [notebookModal, setNotebookModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);
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
    <main
      className="main-section l10"
      style={{
        direction: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start"
      }}
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
              createNoteBook={openCreateNotebookModal}
              createTag={context.createTag}
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
              openModal={openCreateNoteModal}
              closeModal={closenoteModal}
              isOpen={noteModal}
              pushNoteToState={context.pushNoteToState}
              setActiveNote={context.setActiveNote}
            />
            <TagModal
              tags={context.tags}
              createTag={context.createTag}
              openModal={openCreateTagModal}
              closeModal={closeCreateTagModal}
              isOpen={tagModal}
            />
          </>
        )}
      </Paper>
      {/* </Grid>
      </Grid> */}
    </main>
  );
};

export default withRouter(Main);
