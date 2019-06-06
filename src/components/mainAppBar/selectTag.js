import React from "react";
import Select, { components } from "react-select";
import "./selec.css";
import { StyleRounded } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core/";
import makeAnimated from "react-select/animated";

// const MultiValueContainer = props => {
//   return <components.MultiValueContainer {...props} />;
// };

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

//animatedComponets cause some weird error with classnames attached to the Select element :(
// const animatedComponents = makeAnimated(DropdownIndicator);

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
    console.log(this.state.selectedOption);
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
        value={selectedOption}
        onChange={this.handleChange}
        options={this.options()}
        components={{ DropdownIndicator }}
        isMulti
        closeMenuOnSelect={false}
        placeholder="Select Tags"
      />
    );
  }
}

export default SelectTag;
