import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";

import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  makeStyles
} from "@material-ui/core";

import { trashNoteReq, deleteNoteForeverReq } from "../../requests/requests";
import {
  TRASH_NOTE,
  DELETE_NOTE_FOREVER,
  MAKE_TOAST
} from "../../context/rootReducer";

const useStyles = makeStyles(theme => ({
  paper: {
    margin: "3rem 1rem"
  }
}));

const DeleteNoteDialog = props => {
  const classes = useStyles();
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleDelete = () => {
    props.close(); //deleteDialogClose
    const activeNote = appState.activeNote;

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
      dispatch({
        type: MAKE_TOAST,
        message: `Moved note '${props.note.title}' to trash`,
        variant: "success"
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
      dispatch({
        type: MAKE_TOAST,
        message: `Deleted Note '${props.note.title}'`,
        variant: "success"
      });
    }
    //if the deleted note is opened -> redirect to /main/
    if (activeNote && activeNote._id === props.note._id) {
      props.history.push("/main/");
    }
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.close}
        aria-labelledby="form-dialog-title"
        classes={{ paper: classes.paper }}
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
};

export default withRouter(DeleteNoteDialog);
