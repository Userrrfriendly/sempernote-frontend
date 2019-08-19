import React, { useState, useEffect, useContext } from "react";
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
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import { notebookRenameReq } from "../../requests/requests";
import { RENAME_NOTEBOOK } from "../../context/rootReducer";

const useStyles = makeStyles(theme => ({
  paper: {
    margin: "3rem 1rem"
  }
}));

export default function RenameNotebook(props) {
  const classes = useStyles();

  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    setValue(props.notebook ? props.notebook.name : "");
  }, [props.notebook]);

  const handleChange = e => {
    if (e.target.value.length < 50) {
      setValue(e.target.value);
      setError(false);
    } else {
      setError("Notebook name cannot exceed 50 characters");
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (value.length === 0) {
      setError("Notebook name must be at least one character long");
    } else {
      const existingNotebooks = appState.notebooks.reduce(
        (accumulator, currentValue) => {
          accumulator.push(currentValue.name.toLowerCase());
          return accumulator;
        },
        []
      );
      if (existingNotebooks.includes(value.toLocaleLowerCase())) {
        setError("A notebook with the same name already exists!");
      } else {
        props.close();
        notebookRenameReq(props.notebook._id, value, appState.token).then(
          res => {
            console.log(res);
            dispatch({
              type: RENAME_NOTEBOOK,
              notebook: res
            });
          }
        );
        setError(false);
      }
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
          <DialogTitle id="form-dialog-title">Rename Notebook</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the new name for the "
              {props.notebook ? props.notebook.name + '" notebook.' : ""}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Notebook name"
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
