import React, { useContext, useState } from "react";
import Context from "../../context/context";
import Select from "react-select";
// import { colourOptions } from '../data';

const SelectNoteBook = props => {
  // const options = props.notebooks.reduce((acc, cur) => {
  //   acc.push(cur.name);
  //   return acc;
  // }, []);
  // const context = useContext(Context);
  const options = props.notebooks.map(book => {
    return { value: book._id, label: book.name };
  });

  const handleChange = selectedOption => {
    setSelectedOption({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  const selectedIndex = options.findIndex(
    option => option.value === props.activeNote.notebook._id
  );
  const [selectedOption, setSelectedOption] = useState(
    selectedIndex // props.activeNote.notebook._id
  );
  // console.log(context);
  const isLoading = props.activeNote ? false : true;

  // const activeNote = props.activeNote
  //   ? props.activeNote.notebook._id
  //   : "Loading...";

  console.log(options, selectedOption);
  return (
    <>
      {/* <p>
        {isLoading} activeNote: {activeNote}
      </p> */}
      <Select
        // defaultValue={options[selectedIndex]}
        value={selectedOption}
        onChange={handleChange}
        name="colors"
        isLoading={isLoading}
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        // hasValue={true}
        // style={{ width: "10rem" }}
        // value={activeNote}
        isSearchable={true}
      />
    </>
  );
};

export default SelectNoteBook;
