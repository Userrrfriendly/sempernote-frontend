import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import "./selec.css";
import { LibraryBooksRounded } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core/";
import { sortByTitleAsc } from "../../helpers/helpers";

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
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState(
    sortByTitleAsc(props.notebooks, "name").map(book => {
      return { value: book._id, label: book.name };
    })
  );

  useEffect(() => {
    setOptions(
      sortByTitleAsc(props.notebooks, "name").map(book => {
        return { value: book._id, label: book.name };
      })
    );
  }, [props.notebooks]);

  useEffect(() => {
    const selectedIndex = options.findIndex(
      option => option.value === props.activeNote.notebook._id
    );
    console.log(selectedIndex);
    setSelectedOption(options[selectedIndex]);
  }, [props.activeNote, options]);

  const handleChange = selectedOption => {
    setSelectedOption(selectedOption);
    console.log(`Notebook selected:`, selectedOption);
    props.moveNoteToNotebook(
      props.activeNote._id,
      selectedOption.value,
      props.activeNote.notebook._id
    );
  };

  return (
    <Select
      className="select-notebook"
      value={selectedOption}
      onChange={handleChange}
      options={options}
      components={{ DropdownIndicator }}
    />
  );
};

export default SelectNotebook;
