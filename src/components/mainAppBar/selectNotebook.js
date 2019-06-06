import React from "react";
import Select, { components } from "react-select";
import "./selec.css";
import { LibraryBooksRounded } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core/";

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

/* DROPDOWN ICON WITH CONTROLLED TOOLTIP 
class DropdownIndicator extends React.Component {
  state = {
    tooltipOpen: false
  };

  handleTooltipClose = () => {
    console.log("tooltip close!");
    this.setState({ tooltipOpen: false });
  };

  handleTooltipOpen = () => {
    console.log("tooltip open!");
    this.setState({ tooltipOpen: true });
  };
  render() {
    return (
      <components.DropdownIndicator {...this.props}>
        <Tooltip
          open={this.state.tooltipOpen}
          onClose={this.handleTooltipClose}
          onOpen={this.handleTooltipOpen}
          onChange={this.handleTooltipClose}
          onMouseEnter={this.handleTooltipOpen}
          onMouseOver={this.handleTooltipOpen}
          placement="right-end"
          title="Change Notebook"
        >
          <LibraryBooksRounded style={{ color: "#202020" }} />
        </Tooltip>
      </components.DropdownIndicator>
    );
  }
}
*/

class SelectNotebook extends React.Component {
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
        value={selectedOption}
        onChange={this.handleChange}
        options={this.options()}
        components={{ DropdownIndicator }}
      />
    );
  }
}

export default SelectNotebook;
