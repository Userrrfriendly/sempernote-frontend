import React, { useState, useEffect, useContext } from "react";
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Button
} from "@material-ui/core";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import { renameTagReq } from "../../requests/requests";
import { RENAME_TAG } from "../../context/rootReducer";

export default function RenameTag(props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    setValue(props.tag ? props.tag.tagname : "");
  }, [props.tag]);

  const handleChange = e => {
    if (e.target.value.length <= 14) {
      setValue(e.target.value);
      setError(false);
    } else {
      setError("Tag name cannot exceed 15 characters");
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (value.length === 0) {
      setError("Tag name must be at least one character long");
    } else {
      const existingTags = appState.tags.reduce((accumulator, currentValue) => {
        accumulator.push(currentValue.tagname.toLowerCase());
        return accumulator;
      }, []);
      if (existingTags.includes(value.toLocaleLowerCase())) {
        setError("A Tag with the same name already exists!");
      } else {
        props.close();
        renameTagReq(props.tag._id, value, appState.token).then(res => {
          console.log(res);
        });
        dispatch({
          type: RENAME_TAG,
          title: value,
          tagID: props.tag._id
        });
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
        style={{ minWidth: "450px" }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">Rename Tag</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the new name for the "
              {props.tag ? props.tag.tagname + '" tag.' : ""}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Tag name"
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
