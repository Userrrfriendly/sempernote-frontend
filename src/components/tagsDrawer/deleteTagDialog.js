import React, { useContext } from "react";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";

import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  Button
} from "@material-ui/core";

import { deleteTagReq } from "../../requests/requests";
import { DELETE_TAG, SET_NOTE_FILTER } from "../../context/rootReducer";
import { TAG } from "../../context/activeUItypes";

export default function DeleteNotebook(props) {
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const handleDelete = () => {
    props.close();
    deleteTagReq(props.tag._id, appState.token).then(r => {
      if (r && r.name === "Error") {
        console.log("failed to Delete!");
        console.log(r.message);
      }
      console.log(r);
    });
    //if the user has filtered the notes by the to-be-deleted-tag (noteFilter ===TAG)
    //reset filter to ALL_NOTES and then delete the TAG.
    if (
      appState.noteFilter.name === TAG &&
      appState.noteFilter.options === props.tag._id
    ) {
      dispatch({
        type: SET_NOTE_FILTER,
        name: "ALL_NOTES"
      });
    }
    dispatch({
      type: DELETE_TAG,
      tagID: props.tag._id
    });
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.close}
        aria-labelledby="form-dialog-title"
        style={{ minWidth: "450px" }}
      >
        <DialogTitle id="form-dialog-title">Delete Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the "
            {props.tag ? props.tag.tagname + '" Tag? ' : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={props.close} color="primary">
            Cancel
          </Button>
          <Button
            style={{ color: "red" }}
            type="submit"
            onClick={handleDelete}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
