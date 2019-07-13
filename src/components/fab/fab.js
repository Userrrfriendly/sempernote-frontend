import React from "react";
import PropTypes from "prop-types";
// import Context from "../../context/context";
import { withStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
// import DeleteIcon from "@material-ui/icons/Delete";
import {
  LibraryAddRounded,
  NoteAddRounded,
  StarRounded,
  // DescriptionRounded,
  LibraryBooksRounded,
  StyleRounded
} from "@material-ui/icons";
import CreateTagIcon from "../svgCreateTag/svgCreateTag";

const styles = theme => ({
  // root: {
  //   height: 380
  // },
  speedDial: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(3)
  }
});

class SpeedDialTooltipOpen extends React.Component {
  state = {
    open: false,
    hidden: false
  };

  actions = [
    {
      icon: <NoteAddRounded />,
      name: "Create Note",
      callback: this.props.createNote
    },
    {
      icon: <LibraryAddRounded />,
      name: "Create Notebook",
      callback: this.props.createNotebook
    },
    {
      icon: <CreateTagIcon />,
      name: "Create Tag",
      callback: this.props.createTag
    },
    { icon: <StarRounded />, name: "Favorites" },
    { icon: <LibraryBooksRounded />, name: "Notebooks" },
    { icon: <StyleRounded />, name: "Tags" }
  ];

  // static contextType = Context;

  handleVisibility = () => {
    this.setState(state => ({
      open: false,
      hidden: !state.hidden
    }));
  };

  handleClick = async cb => {
    await this.setState(state => ({
      open: !state.open
    }));
    // cb();
  };

  handleOpen = () => {
    if (!this.state.hidden) {
      this.setState({
        open: true
      });
    }
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const { classes } = this.props;
    const { hidden, open } = this.state;

    return (
      <div>
        {/* <Button onClick={this.handleVisibility}>Toggle Speed Dial</Button> */}
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          className={classes.speedDial}
          hidden={hidden}
          icon={<SpeedDialIcon />}
          onBlur={this.handleClose}
          onClick={this.handleClick}
          onClose={this.handleClose}
          onFocus={this.handleOpen}
          onMouseEnter={this.handleOpen}
          onMouseLeave={this.handleClose}
          open={open}
        >
          {this.actions.map(action => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.callback}
              // tooltipOpen
            />
          ))}
        </SpeedDial>
      </div>
    );
  }
}

SpeedDialTooltipOpen.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SpeedDialTooltipOpen);
