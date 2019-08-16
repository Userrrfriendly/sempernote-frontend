import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
  Typography,
  useMediaQuery,
  IconButton,
  Tooltip,
  Menu
} from "@material-ui/core";

import { LibraryBooksRounded } from "@material-ui/icons";
import { OutlinedInput } from "@material-ui/core";

import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";
import { moveNoteToNotebookReq } from "../../requests/requests";
import { MOVE_NOTE_TO_NOTEBOOK } from "../../context/rootReducer";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    minWidth: 200,
    maxWidth: 300,
    margin: "0 8px",
    "@media (min-width:1500px) ": {
      maxWidth: "400px"
    }
  },
  input: {
    padding: "10px 14px",
    paddingRight: "14px"
  },
  select: {
    height: "50px",
    backgroundColor: "#fff"
  },
  notebook_typography: {
    marginRight: "2rem"
  },
  icon: {
    margin: "0 6px"
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export default function SelectNotebook() {
  const matches = useMediaQuery("(max-width:1279px)"); //determines wether the 'Select Tag' will be rendered as icon or as select

  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [notebooks, setNotebooks] = useState([]);
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  React.useEffect(() => {
    if (!matches) setLabelWidth(inputLabel.current.offsetWidth);
  }, [matches]);

  const classes = useStyles();
  const [selectedNotebook, setSelectedNotebook] = useState([]);

  function handleChange(event, args) {
    //args === the element that was clicked (id can be retrieved from key property)
    const notebookID = args.key;
    if (selectedNotebook !== notebookID) {
      moveNoteToNotebookReq(
        appState.activeNote._id,
        notebookID,
        appState.token
      ).then(r => console.log(r));

      dispatch({
        type: MOVE_NOTE_TO_NOTEBOOK,
        noteID: appState.activeNote._id,
        newNotebookID: notebookID,
        previousNotebookID: appState.activeNote.notebook._id
      });
    }
    setSelectedNotebook(event.target.value);
  }

  useEffect(() => {
    setSelectedNotebook(appState.activeNote.notebook._id);
  }, [appState.activeNote]);

  useEffect(() => {
    const updatedNotebooks = appState.notebooks.map(book => {
      return {
        name: book.name,
        id: book._id
      };
    });
    setNotebooks(updatedNotebooks);
  }, [appState.notebooks]);

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  function openNotebookMenu(event, id) {
    setAnchorEl(event.currentTarget);
  }

  function handleNotebookMenuClose(e) {
    setAnchorEl(null);
  }

  function handleNotebookMenuClick(event, notebookID) {
    if (selectedNotebook !== notebookID) {
      moveNoteToNotebookReq(
        appState.activeNote._id,
        notebookID,
        appState.token
      ).then(r => console.log(r));

      dispatch({
        type: MOVE_NOTE_TO_NOTEBOOK,
        noteID: appState.activeNote._id,
        newNotebookID: notebookID,
        previousNotebookID: appState.activeNote.notebook._id
      });
      setSelectedNotebook(notebookID);
    }
  }
  //end menu

  return (
    <div className={classes.root}>
      {matches ? (
        <>
          <Tooltip title="Change Notebook">
            <IconButton
              aria-haspopup="true"
              color="inherit"
              onClick={openNotebookMenu}
            >
              <LibraryBooksRounded />
            </IconButton>
          </Tooltip>
          <Menu
            elevation={1}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleNotebookMenuClose}
          >
            {appState.notebooks.map(book => (
              <MenuItem
                key={book._id}
                value={book._id}
                onClick={e => handleNotebookMenuClick.bind(this, e, book._id)()}
              >
                <Checkbox
                  color="default"
                  checked={selectedNotebook.includes(book._id)}
                />
                <Typography variant="inherit" noWrap>
                  {book.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : (
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} htmlFor="select-notebook">
            Notebook
          </InputLabel>

          <Select
            classes={{ icon: classes.icon }}
            className={classes.select}
            IconComponent={LibraryBooksRounded}
            value={selectedNotebook}
            onChange={handleChange}
            input={
              <OutlinedInput
                classes={{ input: classes.input }}
                labelWidth={labelWidth}
                id="select-notebook"
              />
            }
            renderValue={selected => (
              <Typography className={classes.notebook_typography} noWrap={true}>
                {notebooks.find(book => book.id === selected).name}
              </Typography>
            )}
            MenuProps={MenuProps}
          >
            {appState.notebooks.map(book => (
              <MenuItem key={book._id} value={book._id}>
                <Checkbox
                  color="default"
                  checked={selectedNotebook.includes(book._id)}
                />
                <Typography variant="inherit" noWrap>
                  {book.name}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
}
