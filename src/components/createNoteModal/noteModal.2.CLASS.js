import React, { Component } from "react";
import Modal from "react-modal";
import Select, { components } from "react-select";
import { withRouter } from "react-router-dom";
import { selectNotebook } from "../../helpers/helpers";
import { LibraryBooksRounded } from "@material-ui/icons";
import { Typography, TextField, Tooltip, Button } from "@material-ui/core";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "85%",
    minHeight: "30vh",
    maxHeight: "calc(100vh - 30%)",
    boxShadow:
      " 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)",
    overflow: "visible",
    borderRadius: "4px"
  },
  overlay: { zIndex: 2 }
};

//Custom Icon for React-Select
const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <Tooltip title="Select Notebook">
        <LibraryBooksRounded style={{ color: "#202020" }} />
      </Tooltip>
    </components.DropdownIndicator>
  );
};

//requirement for react-modal
Modal.setAppElement("#root");

class NoteModal extends Component {
  state = {
    title: "",
    error: false,
    selectedNotebook: null
  };

  componentDidUpdate(prevProps, prevState) {
    console.log("Note Modal Updated!");
    console.log(prevProps, prevState);
  }

  options = [];
  componentDidMount() {
    //populates options & sets default selected notebook
    this.options = this.props.notebooks.map(notebook => {
      return { value: notebook._id, label: notebook.name };
    });
    this.setState({ selectedNotebook: this.options[0] });
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log(prevProps, prevState);
  // }

  handleSelectChange = selectedNotebook => {
    this.setState({ selectedNotebook });
    // console.log(`Option selected:`, selectedNotebook);
  };

  onTitleChange = e => {
    this.setState({
      title: e.target.value,
      error: false
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const existingNotes = this.props.notes.reduce(
      (accumulator, currentValue) => {
        if (currentValue.notebook.name === this.state.selectedNotebook.label) {
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
    /**
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
      .then(this.setState({ title: "" }))
      .then(this.props.closeModal())
      .catch(error => console.log(error));
  };

  componentWillUnmount() {
    console.log("unmounting modal");
  }

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
          <form onSubmit={this.onSubmit}>
            <div className="modal-content1">
              <Typography variant="h4" component="h1">
                Create Note
              </Typography>
              <div>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Note Title"
                  type="text"
                  fullWidth
                  value={this.state.title}
                  onChange={this.onTitleChange}
                  placeholder="Enter Note Title"
                />

                {/* <span>Select Notebook</span> */}
                <Typography variant="subtitle2" component="p">
                  Select Notebook
                </Typography>
                <Select
                  aria-label={"select notebook"}
                  defaultValue={this.options[0]}
                  isSearchable={true}
                  onChange={this.handleSelectChange}
                  options={this.options}
                  components={{ DropdownIndicator }}
                />
              </div>
            </div>
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <Button
                type="button"
                onClick={this.props.closeModal}
                color="primary"
              >
                Cancel
              </Button>
              <Button type="submit" onClick={this.onSubmit} color="primary">
                Create Note
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

export default withRouter(NoteModal);
