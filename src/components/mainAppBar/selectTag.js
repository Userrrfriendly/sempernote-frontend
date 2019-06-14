import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import "./selec.css";
import { StyleRounded } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core/";
import { find as _find } from "lodash";
// import makeAnimated from "react-select/animated";

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
* will retry to implement it once I figure out how to properly target styles in react select

//the component that will be animated
const MultiValueContainer = props => {
  return <components.DropdownIndicator {...props} />;
};

const animatedComponents = makeAnimated(DropdownIndicator, MultiValueContainer);
*/

const SelectTag = props => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState(
    props.tags.map(tag => {
      return { value: tag._id, label: tag.tagname };
    })
  );

  // useEffect as componentDidMount
  useEffect(() => {
    //this is probably useless if you create a new Tag the second useEffect will PROBABLY still have the old value :(
    console.log("SelectTag useEffect (updated props.tags)");
    const initialOptions = props.tags.map(tag => {
      return { value: tag._id, label: tag.tagname };
    });
    setOptions(initialOptions);
  }, [props.tags]);

  useEffect(() => {
    console.log("SelectTag useEffect (updated props.activeNote || options)");
    const currentTags = options.filter(option =>
      _find(props.activeNote.tags, { _id: option.value })
    );
    setSelectedOption(currentTags);
  }, [props.activeNote, options]);

  const handleChange = (newSelectedOption, args) => {
    console.log(args);
    setSelectedOption(newSelectedOption);
    // console.log(`Option selected:`, selectedOption);
    // console.log(newSelectedOption);

    if (args.action === "select-option") {
      console.log(`tagID=${args.option.value} noteID=${props.activeNote._id}`);
      props.assignTag(args.option.value, props.activeNote._id);
    } else if (args.action === "remove-value") {
      console.log("removing tag from note...");
      props.unAssignTag(args.removedValue.value, props.activeNote._id);
    }
  };

  return (
    <Select
      className="select-tag"
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
