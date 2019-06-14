import React from "react";
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

const MultiValueContainer = props => {
  return <components.DropdownIndicator {...props} />;
};

const animatedComponents = makeAnimated(DropdownIndicator, MultiValueContainer);
*/

class SelectTag extends React.Component {
  state = {
    selectedOption: null
  };

  // options = () => {
  //   return this.props.notebooks.map(book => {
  //     return { value: book._id, label: book.name };
  //   });
  // };

  options = () => {
    return this.props.tags.map(tag => {
      return { value: tag._id, label: tag.tagname };
    });
  };

  componentDidMount() {
    //all this code should move to component did update or make it hook

    const currentTags = this.options().filter(option =>
      _find(this.props.activeNote.tags, { _id: option.value })
    );
    // console.log(currentTags);
    // console.log(this.state.selectedOption);
    this.setState({ selectedOption: currentTags });
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.state.selectedOption);
    // if (this.props.activeNote !== prevProps.activeNote) {
    //   const selectedIndex = this.options().findIndex(
    //     option => option.value === this.props.activeNote.notebook._id
    //   );
    //   this.setState({ selectedOption: this.options()[selectedIndex] });
    // }
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
    console.log(this.state.selectedOption);
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <Select
        className="select-tag"
        value={selectedOption}
        onChange={this.handleChange}
        options={this.options()}
        // components={animatedComponents}
        components={{ DropdownIndicator }}
        isMulti
        closeMenuOnSelect={false}
        placeholder="Select Tags"
      />
    );
  }
}

export default SelectTag;
