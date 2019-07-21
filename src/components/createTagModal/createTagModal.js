import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { Typography, TextField, Button } from "@material-ui/core";
import { CREATE_TAG } from "../../context/rootReducer";
import DispatchContext from "../../context/DispatchContext";
import { createTagReq } from "../../requests/requests";

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

const CreateTagModal = props => {
  const [state, setState] = useState({ value: "", error: false });
  const dispatch = useContext(DispatchContext);

  const onChange = e => {
    if (e.target.value.length <= 15) {
      setState({
        value: e.target.value,
        error: false
      });
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    const existingTags = props.tags.reduce((accumulator, currentValue) => {
      accumulator.push(currentValue.tagname.toLowerCase());
      return accumulator;
    }, []);
    if (
      existingTags.includes(state.value.toLocaleLowerCase()) ||
      state.value === ""
    ) {
      setState({ ...state, error: true });
    } else {
      const updateDB = async () => {
        createTagReq(state.value, props.token).then(tag => {
          dispatch({
            type: CREATE_TAG,
            tag
          });
        });
      };

      updateDB()
        .then(
          setState({
            value: "",
            error: false
          })
        )
        .then(props.closeModal);
    }
  };

  return (
    <div>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.closeModal}
        style={customStyles}
        contentLabel="Create Tag" //improves accessibility
      >
        <form onSubmit={onSubmit}>
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
                value={state.value}
                onChange={onChange}
                placeholder="Enter Tag Name"
              />
            </div>
            {state.error && state.value && (
              <p style={{ color: "red" }}>
                Tag "{state.value}" already exists!
              </p>
            )}
            {state.error && !state.value && (
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
            <Button type="button" onClick={props.closeModal} color="primary">
              Cancel
            </Button>
            <Button type="submit" onClick={onSubmit} color="primary">
              Create Tag
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CreateTagModal;
