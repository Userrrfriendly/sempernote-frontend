import React, { useContext } from "react";
import Context from "../../context/context";
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  Button
} from "@material-ui/core";

export default function DeleteNotebook(props) {
  const context = useContext(Context);

  const handleDelete = () => {
    // props.closeMenu();
    props.close();
    context.notebookDelete(props.notebook._id);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.close}
        aria-labelledby="form-dialog-title"
        style={{ minWidth: "450px" }}
      >
        <DialogTitle id="form-dialog-title">Rename Notebook</DialogTitle>
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
