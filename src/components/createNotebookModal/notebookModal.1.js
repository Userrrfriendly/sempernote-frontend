import React, { Component } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "35%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    minHeight: "30vh",
    maxHeight: "45vh",
    boxShadow:
      " 0 24px 38px 3px rgba(0,0,0,0.28), 0 9px 46px 8px rgba(0,0,0,0.24), 0 11px 15px -7px rgba(0,0,0,0.4)"
  }
};

Modal.setAppElement("#root");

class NotebookModal extends Component {
  state = {
    value: "",
    error: false
  };

  inputRef = React.createRef();

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

  // openModal = () => {
  //   this.setState({ modalIsOpen: true });
  // };

  // closeModal = () => {
  //   this.setState({ modalIsOpen: false });
  // };

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
          contentLabel="Create Notebook" //improves accessibility
        >
          <form
            id="create-notebook"
            className="modal1 hoberable"
            onSubmit={this.onSubmit}
          >
            <div className="modal-content1">
              <h4>Create Notebook</h4>
              <div
                className={
                  this.state.error
                    ? "red-text input-field col s6"
                    : "input-field col s6"
                }
              >
                <i className="material-icons prefix">library_add</i>
                <label htmlFor="notebookmodal__input">
                  Enter notebook name
                </label>
                <input
                  ref={this.inputRef}
                  autoFocus={true}
                  type="text"
                  id="notebookmodal__input"
                  onChange={this.onChange}
                  value={this.state.value}
                />
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
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              {/* <button
                style={{ fontWeight: "bold", marginLeft: "1rem" }}
                type="submit"
                className="waves-effect waves-green btn-flat btn-large green-text"
                onClick={this.onSubmit}
              >
                Create
              </button>
              <button
                style={{ fontWeight: "bold", order: "-1", marginLeft: "1rem" }}
                onClick={this.props.closeModal}
                className="red-text modal-close waves-effect waves-green btn-large btn-flat"
              >
                Cancel
              </button> */}
              <button
                //type="button" ensures that upon pressing the enter key the button isn't triggered and the form is not submitted, more:
                //https://stackoverflow.com/questions/42053775/getting-error-form-submission-canceled-because-the-form-is-not-connected
                type="button"
                style={{ fontWeight: "bold" }}
                onClick={this.props.closeModal}
                className="red-text modal-close waves-effect waves-green btn-large btn-flat"
              >
                Cancel
              </button>
              <button
                style={{ fontWeight: "bold", marginLeft: "1rem" }}
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

export default NotebookModal;
