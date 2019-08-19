import React, { useState, useEffect, useContext } from "react";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Button,
  makeStyles
} from "@material-ui/core";
import { RENAME_NOTE } from "../../context/rootReducer";
import { renameNoteReq } from "../../requests/requests";

const useStyles = makeStyles(theme => ({
  paper: {
    margin: "3rem 1rem"
  }
}));

export default function RenameNoteDialog(props) {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    setValue(props.note ? props.note.title : "");
  }, [props.note]);

  const handleChange = e => {
    if (e.target.value.length < 50) {
      setValue(e.target.value);
      setError(false);
    } else {
      setError("Note title cannot exceed 50 characters");
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const str = value;
    if (str && str.trim() !== "") {
      // if str is not empty:
      const existingNotes = appState.notes.reduce(
        (accumulator, currentValue) => {
          accumulator.push(currentValue.title.toLowerCase());
          return accumulator;
        },
        []
      );
      if (existingNotes.includes(str.toLocaleLowerCase().trim())) {
        setError("A note with the same title already exists!");
      } else {
        props.close();
        dispatch({
          type: RENAME_NOTE,
          _id: props.note._id,
          newTitle: str.trim()
        });
        renameNoteReq(props.note._id, str.trim(), appState.token).then(r =>
          console.log(r)
        );

        setError(false);
      }
    } else {
      setError("Note title must be at least one character long");
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
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">Rename note</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the new name for the "
              {props.note ? props.note.title + '" note.' : ""}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Note title"
              type="text"
              fullWidth
              value={value}
              onChange={handleChange}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={props.close} color="primary">
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} color="primary">
              Rename
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
