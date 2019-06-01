import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import Context from "../../context/context";

import "./main.css";
import ExpandedNote from "../editor/expandedNote";
import NoteListItem from "./NoteListItem";
import LoadingBlocks from "../loading/loadingBlocks";
// import NoteHeader from "../noteHeader/noteHeader";
import NotebookModal from "../createNotebookModal/notebookModal";
import NoteModal from "../createNoteModal/noteModal";
import SideNav from "../sideNav/sidenav";
//MateriaUI imports
import { Hidden, Grid } from "@material-ui/core";
// import useMediaQuery from "@material-ui/core/useMediaQuery"; //cant use hooks with class components

import Fab from "../fab/fab";
import NoteHeader from "../noteHeader/noteHeader";
import Paper from "../paper/paper";

class Main extends Component {
  state = {
    createNotebookModalIsOpen: false,
    createNoteIsOpen: false
  };

  static contextType = Context;

  /**NOTEBOOK Modal */
  openCreateNotebookModal = () => {
    this.setState({ createNotebookModalIsOpen: true });
  };

  closeCreateNotebookModal = () => {
    this.setState({ createNotebookModalIsOpen: false });
  };

  /**NOTE Modal */
  openCreateNoteModal = () => {
    this.setState({ createNoteIsOpen: true });
  };

  closeCreateNoteModal = () => {
    this.setState({ createNoteIsOpen: false });
  };

  expandNote = (noteId, notebookId) => {
    console.log(
      `note with ID ${noteId} and notebookID: ${notebookId} expanded`
    );
    this.context.setActiveNotebook(notebookId);
    this.context.setActiveNote(noteId);
    let path = `/main/editor`;
    this.props.history.push(path);
  };

  componentDidUpdate(prevProps) {
    // console.log("MAIN updated");
    // console.log(prevProps.location.pathname);
    // console.log(this.props.location.pathname);

    //probably will need more solid logic in the future but this will do for now
    window.onpopstate = e => {
      if (
        this.props.location.pathname === "/main/" &&
        this.context.activeNote
      ) {
        this.context.setActiveNote(null);
      }
      //detects if the back button was pressed
      console.log("back button was pressed");
    };
  }

  render() {
    // const matchesCards = useMediaQuery("(min-width:350px)");
    const renderNotes = this.context.notes ? (
      this.context.notes.map(note => {
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
            expandNote={this.expandNote.bind(this, note._id, note.notebook._id)}
          />
        );
      })
    ) : (
      <LoadingBlocks />
    );

    // const containerCssClass = this.context.activeNote
    //   ? "hide-on-small-only note-container"
    //   : "note-container";

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
          <Grid item style={{ marginLeft: "60px" }}>
            {/* <NoteHeader
              activeNote={this.context.activeNote}
              notebooks={this.context.notebooks}
            /> */}
            <Paper>
              <NoteHeader />
              <Route
                exact
                path="/main/"
                render={props => (
                  <Fab
                    createNote={this.openCreateNoteModal}
                    createNoteBook={this.openCreateNotebookModal}
                  />
                )}
              />

              {/* {!this.context.activeNote && (
            )} */}
              <div className="main-subcontainer">
                {!this.context.activeNote && (
                  <div className="note-container">{renderNotes}</div>
                )}
                <Switch>
                  <Route
                    exact
                    path="/main/editor/"
                    render={props => (
                      <>
                        {this.context.activeNote && (
                          <ExpandedNote
                            note={this.context.activeNote}
                            updateNoteBody={this.context.updateNoteBody}
                          />
                        )}
                      </>
                    )}
                  />
                </Switch>
              </div>
              {/* whats the point of conditional rendering? ther will always be at least one notebook(hopefully) */}
              {this.context.notebooks && (
                <>
                  <NotebookModal
                    notebooks={this.context.notebooks}
                    createNotebook={this.context.createNotebook}
                    openModal={this.openCreateNotebookModal}
                    closeModal={this.closeCreateNotebookModal}
                    isOpen={this.state.createNotebookModalIsOpen}
                  />

                  <NoteModal
                    notes={this.context.notes} //will use for validation to avoid creating duplicate notes
                    notebooks={this.context.notebooks}
                    pushNoteToServer={this.context.pushNoteToServer}
                    openModal={this.openCreateNoteModal}
                    closeModal={this.closeCreateNoteModal}
                    isOpen={this.state.createNoteIsOpen}
                    pushNoteToState={this.context.pushNoteToState}
                    setActiveNote={this.context.setActiveNote}
                  />
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </main>
    );
  }
}

export default withRouter(Main);
