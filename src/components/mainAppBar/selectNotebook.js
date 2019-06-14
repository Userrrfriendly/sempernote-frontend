import React from "react";
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

  options = () => {
    //display the notebooks in alphabetical order
    return sortByTitleAsc(this.props.notebooks, "name").map(book => {
      return { value: book._id, label: book.name };
    });
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
    // if (this.props.activeNote !== prevProps.activeNote) {
    //   const selectedIndex = this.options().findIndex(
    //     option => option.value === this.props.activeNote.notebook._id
    //   );
    //   this.setState({ selectedOption: this.options()[selectedIndex] });
    // }
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Notebook selected:`, selectedOption);
    this.props.moveNoteToNotebook(
      this.props.activeNote._id,
      selectedOption.value,
      this.props.activeNote.notebook._id
    );
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <Select
        className="select-notebook"
        value={selectedOption}
        onChange={this.handleChange}
        options={this.options()}
        components={{ DropdownIndicator }}
      />
    );
  }
}

export default SelectNotebook;
