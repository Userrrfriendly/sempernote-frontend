import React, { Component } from "react";
import M from "materialize-css";

class NotebookModal extends Component {
  //if error is true the modal doesn't close, error becomes true on submit if a notebook with the same name exists
  state = {
    value: "",
    error: false
  };

  inputRef = React.createRef();

  componentDidUpdate() {
    console.log("modal updates");
    this.inputRef.current.focus();
  }

  onChange = e => {
    this.setState({
      value: e.target.value,
      error: false
    });
  };

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
        const inst = M.Modal.getInstance(document.querySelector(".modal"));
        inst.close();
      };
      updateDB().then(
        this.setState({
          value: "",
          error: false
        })
      );
    }
  };

  render() {
    return (
      <form
        id="create-notebook"
        className="modal hoberable"
        onSubmit={this.onSubmit}
      >
        {/* <form
          className="row hoverable center-text authscreen"
          onSubmit={this.onSubmit}
        ></form> */}
        <div className="modal-content">
          <h4>Create Notebook</h4>
          <div
            className={
              this.state.error
                ? "red-text input-field col s6"
                : "input-field col s6"
            }
          >
            <i className="material-icons prefix">library_add</i>
            <label htmlFor="notebookmodal__input">Enter notebook name</label>
            <input
              ref={this.inputRef}
              autoFocus={true}
              type="text"
              id="notebookmodal__input"
              onChange={this.onChange}
              value={this.state.value}
            />
            {/* <textarea
              onChange={this.onChange}
              value={this.state.value}
              id="notebookmodal__input"
              className="materialize-textarea"
            />
            <label htmlFor="notebookmodal__input">Enter notebook name</label> */}
          </div>
          {this.state.error && this.state.value && (
            <p className="red-text">
              Notebook "{this.state.value}" already exists!
            </p>
          )}
          {this.state.error && !this.state.value && (
            <p className="red-text">Please enter a notebook title</p>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="reset"
            className="red-text modal-close waves-effect waves-green btn-flat"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="waves-effect waves-green btn-flat green-text"
            onClick={this.onSubmit}
          >
            Create
          </button>
        </div>
      </form>
    );
  }
}

export default NotebookModal;
