import React, {
  useState
  // useContext
} from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Tooltip } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import { SortByAlpha } from "@material-ui/icons";

// import Context from "../../context/context";
import {
  sortByDateNewestFirst,
  sortByDateOldestFirst,
  sortByTitleAsc,
  sortByTitleDes
} from "../../helpers/helpers";
// const useStyles = makeStyles(theme => ({
//   root: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: theme.palette.background.paper
//   }
// }));

const options = [
  "Created (newest first)",
  "Created (oldest first)",
  "Modified (newest first)",
  "Modified (oldest first)",
  "Title (ascending)",
  "Title (descending)"
];

const SortMenu = props => {
  // const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(2);
  // const context = useContext(Context);
  function handleClickListItem(event) {
    setAnchorEl(event.currentTarget);
    // console.log("handleClickListItem");
  }

  function handleMenuItemClick(event, index) {
    setSelectedIndex(index);
    const shortedNotes = props.filteredNotes
      ? [...props.filteredNotes]
      : [...props.notes];
    switch (index) {
      case 0:
        // props.setFilteredNotes(
        //   sortByDateNewestFirst(shortedNotes, "createdAt")
        // );
        props.updateNotes(sortByDateNewestFirst(shortedNotes, "createdAt"));
        // console.log(options[index]);
        break;
      case 1:
        props.updateNotes(sortByDateOldestFirst(shortedNotes, "createdAt"));
        // console.log(options[index]);
        break;
      case 2:
        props.updateNotes(sortByDateNewestFirst(shortedNotes, "updatedAt"));
        // console.log(options[index]);
        break;
      case 3:
        props.updateNotes(sortByDateOldestFirst(shortedNotes, "updatedAt"));
        // console.log(options[index]);
        break;
      case 4:
        // props.setFilteredNotes(sortByTitleAsc(shortedNotes));
        props.updateNotes(sortByTitleAsc(shortedNotes));
        // console.log(options[index]);
        break;
      case 5:
        props.updateNotes(sortByTitleDes(shortedNotes));
        // console.log(options[index]);
        break;
      default:
        break;
    }
    setAnchorEl(null);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Tooltip title="sort">
        <IconButton
          // button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="When device is locked"
          onClick={handleClickListItem}
        >
          <SortByAlpha />
        </IconButton>
      </Tooltip>

      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            // disabled={index === 0}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SortMenu;
