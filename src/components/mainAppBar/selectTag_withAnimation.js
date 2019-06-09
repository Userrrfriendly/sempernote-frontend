import React from "react";
import Select, { components } from "react-select";
import "./selec.css";
import { StyleRounded } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core/";
import makeAnimated from "react-select/animated";

/**Change Icon on React-Select dropdown
 * https://github.com/JedWatson/react-select/issues/3493
 */
const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <Tooltip title="Change Notebook">
        <StyleRounded style={{ color: "#202020" }} />
      </Tooltip>
    </components.DropdownIndicator>
  );
};

const MultiValueContainer = props => {
  return <components.DropdownIndicator {...props} />;
};
const animatedComponents = makeAnimated(DropdownIndicator, MultiValueContainer);

// export default function AnimatedMulti() {
//   return (
//     <Select
//       closeMenuOnSelect={false}
//       components={animatedComponents}
//       defaultValue={[colourOptions[4], colourOptions[5]]}
//       isMulti
//       options={colourOptions}
//     />
//   );
// }

class SelectTag extends React.Component {
  state = {
    selectedOption: null
  };

  componentDidMount() {
    const selectedIndex = this.options().findIndex(
      option => option.value === this.props.activeNote.notebook._id
    );
    console.log(this.state.selectedOption);
    console.log(selectedIndex);
    this.setState({ selectedOption: this.options()[selectedIndex] });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("select updated");
    if (this.props.activeNote !== prevProps.activeNote) {
      const selectedIndex = this.options().findIndex(
        option => option.value === this.props.activeNote.notebook._id
      );
      this.setState({ selectedOption: this.options()[selectedIndex] });
    }
  }

  options = () => {
    return this.props.notebooks.map(book => {
      return { value: book._id, label: book.name };
    });
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };
  render() {
    const { selectedOption } = this.state;

    return (
      <Select
        className="select-tag"
        classNamePrefix="select"
        value={selectedOption}
        onChange={this.handleChange}
        options={this.options()}
        components={animatedComponents}
        isMulti
        closeMenuOnSelect={false}
      />
    );
  }
}

export default SelectTag;
