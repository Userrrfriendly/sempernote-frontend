import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";
// import InboxIcon from "@material-ui/icons/Inbox";
// import {DraftsIcon} from "@material-ui/icons/Drafts";
import {
  // AddRounded,
  // AddCircleRounded,
  NoteAddRounded,
  SearchRounded,
  StarRounded,
  // NoteRounded,
  DescriptionRounded,
  LibraryBooksRounded,
  LibraryAddRounded,
  StyleRounded
} from "@material-ui/icons";
// import Note_Add from "@material-ui/icons/Note_add";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 60,
    backgroundColor: theme.palette.background.paper,
    height: "100vh",
    position: "fixed",
    top: "0",
    boxShadow:
      "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)"
  },
  list_item: {
    marginBottom: "1rem"
  }
}));

function SelectedListItem() {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(4);

  function handleListItemClick(event, index) {
    setSelectedIndex(index);
  }

  console.log(selectedIndex);
  return (
    <div className={classes.root}>
      <List component="nav">
        <ListItem
          style={{ marginTop: "2rem" }}
          className={classes.list_item}
          button
          selected={selectedIndex === 0}
          onClick={event => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <NoteAddRounded />
          </ListItemIcon>
        </ListItem>
        <ListItem
          className={classes.list_item}
          button
          selected={selectedIndex === 1}
          onClick={event => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <LibraryAddRounded />
          </ListItemIcon>
        </ListItem>
        {/* </List>
      <List component="nav"> */}
        <ListItem
          className={classes.list_item}
          button
          selected={selectedIndex === 2}
          onClick={event => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <SearchRounded />
          </ListItemIcon>
        </ListItem>
        <ListItem
          className={classes.list_item}
          button
          selected={selectedIndex === 3}
          onClick={event => handleListItemClick(event, 3)}
        >
          <ListItemIcon>
            <StarRounded />
          </ListItemIcon>
        </ListItem>
        <ListItem
          className={classes.list_item}
          button
          selected={selectedIndex === 4}
          onClick={event => handleListItemClick(event, 4)}
        >
          <ListItemIcon>
            <DescriptionRounded />
          </ListItemIcon>
        </ListItem>
        <ListItem
          className={classes.list_item}
          button
          selected={selectedIndex === 5}
          onClick={event => handleListItemClick(event, 5)}
        >
          <ListItemIcon>
            <LibraryBooksRounded />
          </ListItemIcon>
        </ListItem>
        <ListItem
          className={classes.list_item}
          button
          selected={selectedIndex === 6}
          onClick={event => handleListItemClick(event, 6)}
        >
          <ListItemIcon>
            <StyleRounded />
          </ListItemIcon>
        </ListItem>
      </List>
    </div>
  );
}

export default SelectedListItem;
