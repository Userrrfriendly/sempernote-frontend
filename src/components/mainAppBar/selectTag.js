import React, { useEffect, useState, useContext } from "react";
import Select, { components } from "react-select";
// import "./selec.css";
import { StyleRounded } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core/";
import { find as _find } from "lodash";
import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";
import { assignTagReq, unAssignTagReq } from "../../requests/requests";
import { ASSIGN_TAG, UNASSIGN_TAG } from "../../context/rootReducer";
// import makeAnimated from "react-select/animated";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  select_tag: {
    minWidth: "12rem",
    flexGrow: "1",
    maxWidth: "30rem",
    marginLeft: "1rem",
    /* override Quill's toolbar z-index:1 */
    zIndex: "2"
    /* if i change the height it will drift upwards */
    /* height: 3rem; */
    /* max-height: 64px; */
  }
}));

/**Change Icon on React-Select dropdown
 * https://github.com/JedWatson/react-select/issues/3493
 */
const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <Tooltip title="Edit Tags">
        <StyleRounded style={{ color: "#202020" }} />
      </Tooltip>
    </components.DropdownIndicator>
  );
};

/*
* animatedComponets cause inconsistencies with height (it's smaller than the select notebook...)
* worth retrying to implement it once I figure out how to properly target styles in react select

//the component that will be animated
const MultiValueContainer = props => {
  return <components.DropdownIndicator {...props} />;
};

const animatedComponents = makeAnimated(DropdownIndicator, MultiValueContainer);
*/

const SelectTag = props => {
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const classes = useStyles();
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState(
    appState.tags.map(tag => {
      return { value: tag._id, label: tag.tagname };
    })
  );

  //update Options if a tag was created/deleted
  useEffect(() => {
    console.log("SelectTag useEffect (updated appState.tags)");
    const initialOptions = appState.tags.map(tag => {
      return { value: tag._id, label: tag.tagname };
    });
    setOptions(initialOptions);
  }, [appState.tags]);

  useEffect(() => {
    console.log("SelectTag useEffect (updated props.activeNote || options)");
    const currentTags = options.filter(option =>
      _find(appState.activeNote.tags, { _id: option.value })
    );
    setSelectedOption(currentTags);
  }, [appState.activeNote, options]);

  const handleChange = (newSelectedOption, args) => {
    // console.log(args);
    setSelectedOption(newSelectedOption);

    if (args.action === "select-option") {
      // console.log(
      //   `tagID=${args.option.value} noteID=${appState.activeNote._id}`
      // );
      assignTagReq(
        args.option.value,
        appState.activeNote._id,
        appState.token
      ).then(r => console.log(r));
      dispatch({
        type: ASSIGN_TAG,
        tagID: args.option.value,
        noteID: appState.activeNote._id
      });
    } else if (args.action === "remove-value") {
      // console.log("removing tag from note...");
      unAssignTagReq(
        args.removedValue.value,
        appState.activeNote._id,
        appState.token
      );
      dispatch({
        type: UNASSIGN_TAG,
        tagID: args.removedValue.value,
        noteID: appState.activeNote._id
      });
    }
  };

  return (
    <Select
      // className="select-tag"
      className={classes.select_tag}
      value={selectedOption}
      onChange={handleChange}
      options={options}
      // components={animatedComponents}
      components={{ DropdownIndicator }}
      isMulti
      closeMenuOnSelect={false}
      placeholder="Select Tags"
      isClearable={false}
    />
  );
};

export default SelectTag;
