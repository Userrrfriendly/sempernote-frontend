import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import Context from "../../context/context";

import "./main.css";
import ExpandedNote from "../editor/expandedNote";
import NoteListItem from "./NoteListItem";
import LoadingBlocks from "../loading/loadingBlocks";
import NoteHeader from "../noteHeader/noteHeader";
import NotebookModal from "../createNotebookModal/notebookModal";
import NoteModal from "../createNoteModal/noteModal";

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

  componentDidUpdate() {
    console.log("MAIN updated");
    // console.log(this.context.notes);
  }

  render() {
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

    const containerCssClass = this.context.activeNote
      ? "hide-on-small-only note-container"
      : "note-container";

    return (
      <main className="main-section l10">
        <NoteHeader
          activeNote={this.context.activeNote}
          notebooks={this.context.notebooks}
        />
        {/*  */}
        <Route
          // exact
          path="/main/"
          render={props => (
            <div className="fixed-action-btn action-btn-editor">
              <button
                // title="create note"
                // aria-label="create note"
                className="btn-floating btn-large green"
                // onClick={this.context.createNote}
              >
                <i className="material-icons">create</i>
              </button>
              {/* <button className="btn-floating btn-large red">
                <i className="large material-icons">mode_edit</i>
              </button> */}

              <ul>
                <li>
                  <button className="btn-floating red">
                    <i className="material-icons">insert_chart</i>
                  </button>
                </li>
                <li>
                  <button className="btn-floating yellow darken-1">
                    <i className="material-icons">add</i>
                  </button>
                </li>
                <li>
                  <button className="btn-floating green">
                    <i className="material-icons">publish</i>
                  </button>
                </li>
                <li>
                  <button
                    title="create note"
                    aria-label="create note"
                    // onClick={this.context.createNote}
                    onClick={this.openCreateNoteModal}
                    className="btn-floating btn-large blue"
                  >
                    <i className="material-icons">note_add</i>
                  </button>
                </li>
                <li>
                  <button
                    className="btn-floating btn-large green btn modal-trigger"
                    title="create notebook"
                    onClick={this.openCreateNotebookModal}
                  >
                    <i className="material-icons">library_add</i>
                  </button>
                </li>
              </ul>
            </div>
          )}
        />

        <div className="main-subcontainer">
          <div className={containerCssClass}>{renderNotes}</div>
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
      </main>
    );
  }
}

export default withRouter(Main);
