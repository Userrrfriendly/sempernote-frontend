import React, { Component } from "react";
import Modal from "react-modal";
import { Typography, TextField, Button } from "@material-ui/core";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "85%",
    minHeight: "25vh",
    maxHeight: "calc(100vh - 30%)",
    boxShadow:
      " 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)",
    overflow: "visible",
    borderRadius: "4px"
  },
  overlay: { zIndex: 1302 }
};

//required for react-modal
Modal.setAppElement("#root");

class NotebookModal extends Component {
  state = {
    value: "",
    error: false
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
      error: false
    });
  };

  componentDidUpdate() {
    console.log("noteBOOK modal updated");
  }

  onSubmit = e => {
    e.preventDefault();
    const existingNotebooks = this.props.notebooks.reduce(
      (accumulator, currentValue) => {
        accumulator.push(currentValue.name.toLowerCase());
        return accumulator;
      },
      []
    );
    if (
      existingNotebooks.includes(this.state.value.toLocaleLowerCase()) ||
      this.state.value === ""
    ) {
      // console.log("A notebook with the same name already exists!");
      this.setState({
        error: true
      });
    } else {
      // console.log(`creating notebook...${this.state.value}`);
      const updateDB = async () => {
        this.props.createNotebook(this.state.value);
      };

      updateDB()
        .then(
          this.setState({
            value: "",
            error: false
          })
        )
        .then(this.props.closeModal);
    }
  };

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.props.closeModal}
          style={customStyles}
          contentLabel="Create Notebook" //improves accessibility
        >
          <form onSubmit={this.onSubmit}>
            <div className="modal-content1">
              <Typography variant="h4" component="h1">
                Create Notebook
              </Typography>
              <div>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Note Title"
                  type="text"
                  fullWidth
                  value={this.state.value}
                  onChange={this.onChange}
                  placeholder="Enter Notebook Name"
                />
              </div>
              {this.state.error && this.state.value && (
                <p style={{ color: "red" }}>
                  Notebook "{this.state.value}" already exists!
                </p>
              )}
              {this.state.error && !this.state.value && (
                <p style={{ color: "red" }}>Please enter a notebook title</p>
              )}
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
              {/*type="button" ensures that upon pressing the enter key the button isn't triggered and the form is not submitted, more:
                https://stackoverflow.com/questions/42053775/getting-error-form-submission-canceled-because-the-form-is-not-connected */}
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

export default NotebookModal;
