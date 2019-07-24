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

import { trashNoteReq, deleteNoteForeverReq } from "../../requests/requests";
import { TRASH_NOTE, DELETE_NOTE_FOREVER } from "../../context/rootReducer";

export default function DeleteNotebook(props) {
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleDelete = () => {
    props.close(); //deleteDialogClose
    if (!props.note.trash) {
      //if note is not TRASH -> softDelete (move it to TRASH):
      trashNoteReq(props.note, appState.token).then(r => {
        if (r && r.name === "Error") {
          console.log("failed to move note to TRASH!");
          console.log(r.message);
        }
      });
      dispatch({
        type: TRASH_NOTE,
        note: props.note
      });
    } else {
      //note is TRASH -> delete note forever
      deleteNoteForeverReq(props.note, appState.token).then(r => {
        if (r && r.name === "Error") {
          console.log("failed to Permanently Delete Note!");
          console.log(r.message);
        }
      });
      dispatch({
        type: DELETE_NOTE_FOREVER,
        note: props.note
      });
    }
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.close}
        aria-labelledby="form-dialog-title"
        style={{ minWidth: "450px" }}
      >
        <DialogTitle id="form-dialog-title">
          {props.note.trash ? "Delete note forever " : "Move note to Trash"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.note && !props.note.trash
              ? 'Are you sure you want to move note "' +
                props.note.title +
                '" to thrash?'
              : 'Are you sure you want to permanently delete note "' +
                props.note.title +
                '" ? Warning this action cannot be undone!'}
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
