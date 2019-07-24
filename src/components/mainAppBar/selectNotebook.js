import React, { useState, useEffect, useContext } from "react";
import Select, { components } from "react-select";
// import "./selec.css";
import { LibraryBooksRounded } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core/";
import { sortByTitleAsc } from "../../helpers/helpers";
import StateContext from "../../context/StateContext";
import DispatchContext from "../../context/DispatchContext";
import { moveNoteToNotebookReq } from "../../requests/requests";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  select_notebook: {
    minWidth: "8rem",
    flexGrow: "1",
    maxWidth: "12rem",
    /* override Quill's toolbar z-index:1 */
    zIndex: "2"
  }
}));

/**Change Icon on React-Select dropdown
 * https://github.com/JedWatson/react-select/issues/3493
 */
const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <Tooltip title="Change Notebook">
        <LibraryBooksRounded style={{ color: "#202020" }} />
      </Tooltip>
    </components.DropdownIndicator>
  );
};

const SelectNotebook = props => {
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const classes = useStyles();
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState(
    sortByTitleAsc(appState.notebooks, "name").map(book => {
      return { value: book._id, label: book.name };
    })
  );

  useEffect(() => {
    setOptions(
      sortByTitleAsc(appState.notebooks, "name").map(book => {
        return { value: book._id, label: book.name };
      })
    );
  }, [appState.notebooks]);

  useEffect(() => {
    const selectedIndex = options.findIndex(
      option => option.value === appState.activeNote.notebook._id
    );
    setSelectedOption(options[selectedIndex]);
  }, [appState.activeNote, options]);

  const handleChange = selectedOption => {
    setSelectedOption(selectedOption);

    moveNoteToNotebookReq(
      appState.activeNote._id,
      selectedOption.value,
      appState.token
    ).then(r => console.log(r));

    dispatch({
      type: "MOVE_NOTE_TO_NOTEBOOK",
      noteID: appState.activeNote._id,
      newNotebookID: selectedOption.value,
      previousNotebookID: appState.activeNote.notebook._id
    });
  };

  return (
    <Select
      // className="select-notebook"
      isDisabled={appState.activeNote.trash}
      className={classes.select_notebook}
      value={selectedOption}
      onChange={handleChange}
      options={options}
      components={{ DropdownIndicator }}
    />
  );
};

export default SelectNotebook;
