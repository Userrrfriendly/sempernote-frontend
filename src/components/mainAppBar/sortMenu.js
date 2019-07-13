import React, { useState, useContext } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import DispatchContext from "../../context/DispatchContext";
import { SORT_NOTES } from "../../context/rootReducer";
import { SortByAlpha } from "@material-ui/icons";

const options = [
  "Created (newest first)",
  "Created (oldest first)",
  "Modified (newest first)",
  "Modified (oldest first)",
  "Title (ascending)",
  "Title (descending)"
];

const SortMenu = props => {
  const dispatch = useContext(DispatchContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(2);
  function handleClickListItem(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuItemClick(event, index) {
    setSelectedIndex(index);

    switch (index) {
      case 0:
        dispatch({
          type: SORT_NOTES,
          method: "sortByDateNewestFirst",
          sortField: "createdAt"
        });
        break;
      case 1:
        dispatch({
          type: SORT_NOTES,
          method: "sortByDateOldestFirst",
          sortField: "createdAt"
        });
        break;
      case 2:
        dispatch({
          type: SORT_NOTES,
          method: "sortByDateNewestFirst",
          sortField: "updatedAt"
        });
        break;
      case 3:
        dispatch({
          type: SORT_NOTES,
          method: "sortByDateOldestFirst",
          sortField: "updatedAt"
        });
        break;
      case 4:
        dispatch({
          type: SORT_NOTES,
          method: "sortByTitleAsc"
        });
        break;
      case 5:
        dispatch({
          type: SORT_NOTES,
          method: "sortByTitleDes"
        });
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
