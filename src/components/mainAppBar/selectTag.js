import React, { useContext, useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import {
  MenuItem,
  FormControl,
  Select,
  Checkbox,
  Typography,
  OutlinedInput,
  useMediaQuery,
  IconButton,
  Tooltip,
  Menu
} from "@material-ui/core";
import { StyleRounded } from "@material-ui/icons";
import TagChip from "./tagChip";

import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";
import { assignTagReq, unAssignTagReq } from "../../requests/requests";
import { ASSIGN_TAG, UNASSIGN_TAG } from "../../context/rootReducer";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexShrink: 0
  },
  formControl: {
    margin: "0 8px",
    flexShrink: 0,
    "@media (min-width:1280px) ": {
      maxWidth: 350,
      minWidth: 200
    },
    "@media (min-width:1500px) ": {
      maxWidth: "600px"
    }
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    marginRight: "1.2rem",
    maxHeight: "2rem"
  },

  input: {
    padding: "10px 14px",
    paddingRight: "14px"
  },
  select: {
    height: "50px",
    backgroundColor: "#fff"
  },
  tag_counter: {
    padding: "6px",
    borderRadius: "16px",
    margin: "0 10px",
    width: "20px",
    height: "20px",
    border: "1px #e0e0e0 solid",
    textAlign: "center"
  },
  icon: {
    margin: "0 6px"
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export default function SelectTag() {
  const matches = useMediaQuery("(max-width:1279px)"); //determines wether the 'Select Tag' will be rendered as icon or as select
  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [tags, setTags] = useState([]);
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    if (!matches) setLabelWidth(inputLabel.current.offsetWidth);
  }, [matches]);

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  function openTagMenu(event, id) {
    setAnchorEl(event.currentTarget);
  }

  function closeTagMenu(e) {
    setAnchorEl(null);
  }

  function handleTagMenuItemClick(event, tagID) {
    let updatedSelection = [...selectedTags];

    if (selectedTags.includes(tagID)) {
      unAssignTagReq(tagID, appState.activeNote._id, appState.token);
      updatedSelection = updatedSelection.filter(id => id !== tagID);
      dispatch({
        type: UNASSIGN_TAG,
        tagID: tagID,
        noteID: appState.activeNote._id
      });
    } else {
      updatedSelection.push(tagID);
      assignTagReq(tagID, appState.activeNote._id, appState.token).then(r =>
        console.log(r)
      );
      dispatch({
        type: ASSIGN_TAG,
        tagID: tagID,
        noteID: appState.activeNote._id
      });
    }
    setSelectedTags(updatedSelection);
  }
  //end menu

  const classes = useStyles();
  const [selectedTags, setSelectedTags] = useState([]);

  function handleChange(event, args) {
    //args === the element that was clicked (id can be retrieved from key property)
    const tagID = args.key;
    if (selectedTags.includes(tagID)) {
      unAssignTagReq(tagID, appState.activeNote._id, appState.token);
      dispatch({
        type: UNASSIGN_TAG,
        tagID: tagID,
        noteID: appState.activeNote._id
      });
    } else {
      assignTagReq(tagID, appState.activeNote._id, appState.token).then(r =>
        console.log(r)
      );
      dispatch({
        type: ASSIGN_TAG,
        tagID: tagID,
        noteID: appState.activeNote._id
      });
    }

    setSelectedTags(event.target.value);
  }

  useEffect(() => {
    //display tags that are attatched to activeNote (Selected)
    if (appState.activeNote) {
      const activeNoteTags = appState.activeNote.tags.map(tag => {
        return tag._id;
      });
      setSelectedTags(activeNoteTags);
    }
  }, [appState.activeNote]);

  useEffect(() => {
    const updatedTags = appState.tags.map(tag => {
      return {
        name: tag.tagname,
        id: tag._id
      };
    });
    setTags(updatedTags);
  }, [appState.tags]);

  return (
    <div className={classes.root}>
      {matches ? (
        // renders an <IconButton> instead of <Select>
        <>
          <Tooltip title="Edit Tags">
            <IconButton
              aria-haspopup="true"
              color="inherit"
              onClick={openTagMenu}
              disabled={appState.activeNote.trash}
            >
              <StyleRounded />
            </IconButton>
          </Tooltip>
          <Menu
            elevation={1}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={closeTagMenu}
          >
            {tags.map(tag => (
              <MenuItem
                key={tag.id}
                value={tag.id}
                onClick={e => handleTagMenuItemClick.bind(this, e, tag.id)()}
              >
                <Checkbox
                  color="default"
                  checked={selectedTags.includes(tag.id)}
                />
                <Typography variant="inherit" noWrap>
                  {tag.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : (
        <FormControl
          variant="outlined"
          className={classes.formControl}
          disabled={appState.activeNote.trash}
        >
          <InputLabel ref={inputLabel} htmlFor="select-multiple-chip">
            Tags
          </InputLabel>

          <Select
            classes={{ icon: classes.icon }}
            className={classes.select}
            IconComponent={StyleRounded}
            multiple
            value={selectedTags}
            onChange={handleChange}
            input={
              <OutlinedInput
                classes={{ input: classes.input }}
                labelWidth={labelWidth}
                id="select-multiple-chip"
              />
            }
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map((value, index) =>
                  index < 3 ? (
                    <TagChip key={value}>
                      {tags.find(tag => tag.id === value).name}
                    </TagChip>
                  ) : (
                    ""
                  )
                )}
                <Typography className={classes.tag_counter} noWrap={true}>
                  {selected.length}
                </Typography>
              </div>
            )}
            MenuProps={MenuProps}
          >
            {tags.map(tag => (
              <MenuItem key={tag.id} value={tag.id}>
                <Checkbox
                  color="default"
                  checked={selectedTags.includes(tag.id)}
                />
                <Typography variant="inherit" noWrap>
                  {tag.name}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
}
