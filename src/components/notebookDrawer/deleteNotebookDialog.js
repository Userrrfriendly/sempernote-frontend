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

import { notebookDeleteReq } from "../../requests/requests";
import {
  DELETE_NOTEBOOK,
  SET_ACTIVE_NOTE,
  SET_NOTE_FILTER
} from "../../context/rootReducer";

export default function DeleteNotebook(props) {
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const handleDelete = () => {
    props.close();
    notebookDeleteReq(props.notebook._id, appState.token).then(r => {
      if (r && r.name === "Error") {
        console.log("failed to Delete!");
        console.log(r.message);
      } else {
        //if a note from the deleted notebook is opened, a)close it b)set note filter to 'ALL NOTES'
        if (appState.activeNote.notebook._id === r._id) {
          dispatch({
            type: SET_ACTIVE_NOTE,
            _id: null
          });
          dispatch({
            type: SET_NOTE_FILTER,
            name: "ALL_NOTES"
          });
        }
        dispatch({
          type: DELETE_NOTEBOOK,
          _id: r._id
        });
      }
      console.log(r);
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
        <DialogTitle id="form-dialog-title">Delete Notebook</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete notebook "
            {props.notebook ? props.notebook.name + '" notebook? ' : ""}" All
            notes inside it will be moved to thrash!"
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
