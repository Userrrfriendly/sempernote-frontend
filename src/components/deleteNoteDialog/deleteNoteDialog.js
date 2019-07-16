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

import { trashNoteReq } from "../../requests/requests";
import { TRASH_NOTE } from "../../context/rootReducer";

export default function DeleteNotebook(props) {
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleDelete = () => {
    // console.log(props.note);
    props.close();
    trashNoteReq(props.note, appState.token).then(r => {
      if (r && r.name === "Error") {
        console.log("failed to Delete!");
        console.log(r.message);
      }
    });
    dispatch({
      type: TRASH_NOTE,
      note: props.note
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
        <DialogTitle id="form-dialog-title">Delete Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to move note "
            {props.note ? props.note.title : ""}" to thrash?
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
