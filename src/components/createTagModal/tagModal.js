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
  overlay: { zIndex: 1402 }
};

//required for react-modal
Modal.setAppElement("#root");

class TagModal extends Component {
  state = {
    value: "",
    error: false
  };

  onChange = e => {
    if (e.target.value.length < 30) {
      this.setState({
        value: e.target.value,
        error: false
      });
    }
  };

  componentDidUpdate() {
    console.log("noteBOOK modal updated");
  }

  onSubmit = e => {
    e.preventDefault();
    const existingTags = this.props.tags.reduce((accumulator, currentValue) => {
      accumulator.push(currentValue.tagname.toLowerCase());
      return accumulator;
    }, []);
    if (
      existingTags.includes(this.state.value.toLocaleLowerCase()) ||
      this.state.value === ""
    ) {
      this.setState({
        error: true
      });
    } else {
      const updateDB = async () => {
        this.props.createTag(this.state.value);
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
          contentLabel="Create Tag" //improves accessibility
        >
          <form onSubmit={this.onSubmit}>
            <div className="modal-content1">
              <Typography variant="h4" component="h1">
                Create Tag
              </Typography>
              <div>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Tag name"
                  type="text"
                  fullWidth
                  value={this.state.value}
                  onChange={this.onChange}
                  placeholder="Enter Tag Name"
                />
              </div>
              {this.state.error && this.state.value && (
                <p style={{ color: "red" }}>
                  Tag "{this.state.value}" already exists!
                </p>
              )}
              {this.state.error && !this.state.value && (
                <p style={{ color: "red" }}>Please enter a tag name</p>
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
                Create Tag
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

export default TagModal;
