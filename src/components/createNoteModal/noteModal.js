import React, { Component } from "react";
import Modal from "react-modal";
import Select from "react-select";
import { withRouter } from "react-router-dom";
import { selectNotebook } from "../../helpers/helpers";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    minHeight: "30vh",
    maxHeight: "calc(100vh - 30%)",
    boxShadow:
      " 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)",
    overflow: "visible"
  }
};

Modal.setAppElement("#root");

class NoteModal extends Component {
  state = {
    title: "",
    error: false,
    selectedNotebook: null
  };

  //
  componentDidUpdate() {
    console.log("Note Modal Updated!");
  }
  //
  inputRef = React.createRef();

  options = [];
  componentDidMount() {
    //creates options obj for <Select> && selects default notebook
    // move this to update?
    this.options = this.props.notebooks.map(notebook => {
      return { value: notebook._id, label: notebook.name };
    });
    this.setState({ selectedNotebook: this.options[0] });
  }

  handleSelectChange = selectedNotebook => {
    this.setState({ selectedNotebook });
    console.log(`Option selected:`, selectedNotebook);
  };

  onTitleChange = e => {
    this.setState({
      title: e.target.value,
      error: false
    });
  };

  onSubmit = e => {
    e.preventDefault();

    if (!this.state.selectedNotebook) {
      this.setState({ error: true });
      return;
    }

    const existingNotes = this.props.notes.reduce(
      (accumulator, currentValue) => {
        if (currentValue.notebook.name === this.state.selectedNotebook.label) {
          // console.log(currentValue.title.toLowerCase());
          accumulator.push(currentValue.title.toLowerCase());
        }
        return accumulator;
      },
      []
    );

    // IF NOTE WITH THE SAME NAME EXISTS ADD A SUFFIX to the new note(myNote->myNote1, myNote1->myNote2, myNote2->myNote3)
    const initialTitle = this.state.title ? this.state.title : "Untitled Note";
    let index = 1;
    let validatedTitle = initialTitle;
    while (index) {
      if (existingNotes.includes(validatedTitle.toLowerCase())) {
        validatedTitle = validatedTitle.slice(0, initialTitle.length) + index;
        index++;
      } else {
        index = false;
      }
    }

    let path = `/main/editor`;
    const newNote = {
      title: validatedTitle,
      _id: validatedTitle,
      body: JSON.stringify('"{"ops":[{"insert":"\\n"}]}"'),
      createdAt: "",
      temp: true,
      notebook: {
        ...selectNotebook(
          this.props.notebooks,
          this.state.selectedNotebook.value
        )[0]
      }
    };
    console.log(newNote);
    /**The way it is structed it will probably break things once the editor will open
     * SetActiveNote(tempNote created on the client)->opens editor
     * SetActiveNote(actual note as response from server)->opens editor again/rerender
     */
    const updateState = async () => {
      this.props.pushNoteToState(newNote);
    };
    updateState()
      .then(this.props.setActiveNote(validatedTitle))
      .then(this.props.history.push(path))
      .then(this.props.pushNoteToServer(newNote))
      .then(this.props.closeModal())
      .catch(error => console.log(error));
  };

  afterOpenModal = () => {
    this.inputRef.current.focus();
  };

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.props.closeModal}
          style={customStyles}
          contentLabel="Create Note" //improves accessibility
        >
          <form
            id="create-notebook"
            className="modal1 hoberable"
            onSubmit={this.onSubmit}
          >
            <div className="modal-content1">
              <h4>Create Note</h4>
              <div
                className={
                  this.state.error
                    ? "red-text input-field col s6"
                    : "input-field col s6"
                }
              >
                <i className="material-icons prefix">library_add</i>
                <label
                  aria-label="Note title input"
                  htmlFor="notebookmodal__input"
                >
                  Note title
                </label>
                <input
                  // aria-label="enter note title"
                  ref={this.inputRef}
                  autoFocus={true}
                  type="text"
                  id="notebookmodal__input"
                  onChange={this.onTitleChange}
                  value={this.state.title}
                />
                <span>Select Notebook</span>
                <Select
                  aria-label={"select notebook"}
                  defaultValue={this.options[0]}
                  isClearable={true}
                  isSearchable={true}
                  onChange={this.handleSelectChange}
                  options={this.options}
                />
              </div>
              {this.state.error && this.state.title && (
                <p className="red-text">
                  Note "{this.state.title}" already exists!
                </p>
              )}
              {this.state.error && !this.state.selectedNotebook && (
                <p className="red-text">Please select a notebook to proceed</p>
              )}
            </div>
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <button
                type="button"
                style={{ fontWeight: "bold", zIndex: "0" }}
                onClick={this.props.closeModal}
                className="red-text modal-close waves-effect waves-green btn-large btn-flat"
              >
                Cancel
              </button>
              <button
                style={{ fontWeight: "bold", marginLeft: "1rem", zIndex: "0" }}
                type="submit"
                className="waves-effect waves-green btn-flat btn-large green-text"
                onClick={this.onSubmit}
              >
                Create
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

export default withRouter(NoteModal);
