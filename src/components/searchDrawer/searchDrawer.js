import React, { useEffect, useState, useContext, Fragment } from "react";
import { withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import Delta from "quill-delta";

import {
  IconButton,
  List,
  Divider,
  Drawer,
  Tooltip,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  TextField,
  InputAdornment
} from "@material-ui/core";

import {
  SearchRounded,
  Close,
  ChevronLeft,
  DescriptionRounded,
  LibraryBooksRounded,
  StyleRounded
} from "@material-ui/icons";
import Context from "../../context/context";
import { SEARCH, NOTEBOOK, NOTES, TAG } from "../../context/activeUItypes";

import { deltaToPlainText } from "../../helpers/helpers";

const drawerWidth = 400;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },

  menuButton: {
    marginRight: theme.spacing(2),
    position: "fixed",
    left: "40rem",
    zIndex: 3
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    overflowX: "hidden"
  },
  drawerPaper: {
    width: drawerWidth,
    left: "62px",
    overflowX: "hidden"
  },
  drawerHeader: {
    display: "flex",
    // alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    // justifyContent: "flex-end",
    justifyContent: "space-between",
    flexDirection: "column"
    // minHeight: "150px"
  },
  drawerSubHeader: {
    display: "flex",
    justifyContent: "space-between"
  },
  drawerTitle: {
    marginTop: "8px"
  },
  textField: {
    margin: "8px 8px 16px"
  },
  fab: {
    margin: "1rem"
  }
}));

const SearchDrawer = props => {
  const context = useContext(Context);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    console.log("tags useEffect");
    if (props.closed !== SEARCH) {
      setOpen(false);
    }
  }, [props.closed]);

  const classes = useStyles();

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  const handleListClick = e => {
    props.listClick();
    handleDrawerOpen();
  };

  const handleSearch = e => {
    setSearch(e.target.value);
  };

  const previewText = str => {
    const parsedDelta = new Delta(JSON.parse(str));
    let plainText = deltaToPlainText(parsedDelta);
    if (plainText.length > 100) {
      return plainText.slice(0, 100).concat("...");
    }
    return plainText;
  };

  const handleTagClick = (resultID, resultType) => {
    handleDrawerClose();
    switch (resultType) {
      case TAG:
        context.setNoteFilter(TAG, resultID);
        break;
      case NOTEBOOK:
        context.setActiveNotebook(resultID);
        context.setNoteFilter(NOTEBOOK, resultID);
        break;
      case NOTES:
        context.setNoteFilter(NOTES);
        context.setActiveNote(resultID);
        let path = `/main/editor`;
        props.history.push(path);
        break;
      default:
        break;
    }
  };

  const deepSearch = e => {
    e.preventDefault();
    // console.log(`DeepSearching ${search} in notes`);
    const deepSearch = context.notes.filter(note => {
      const parsedDelta = new Delta(JSON.parse(note.body));
      const plainText = deltaToPlainText(parsedDelta);

      return plainText.toLowerCase().includes(search.toLowerCase());
    });
    const noteTitleSearch = context.notes.filter(note =>
      note.title.toLowerCase().includes(search.toLowerCase())
    );
    setResults(noteTitleSearch.concat(deepSearch));
  };

  //determines if the result is a tag,notebook or note
  const resultType = result => {
    if (result.hasOwnProperty("name")) return NOTEBOOK;
    if (result.hasOwnProperty("tagname")) return TAG;
    if (result.hasOwnProperty("title")) return NOTES;
  };

  useEffect(() => {
    console.log("useEffect from Notebook drawer");
    if (!search) {
      setResults([]);
    } else {
      const filteredNotes = context.notes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase())
      );
      const filteredNotebooks = context.notebooks.filter(notebook =>
        notebook.name.toLowerCase().includes(search.toLowerCase())
      );
      const filteredTags = context.tags.filter(tag =>
        tag.tagname.toLowerCase().includes(search.toLowerCase())
      );

      const filteredResults = filteredNotes.concat(
        filteredNotebooks,
        filteredTags
      );

      setResults(filteredResults);
    }
  }, [search, context.tags, context.notebooks, context.notes]);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div
      className={classes.root}
      // role="presentation"
    >
      <Tooltip title="Search" placement="right">
        <ListItem
          className={classes.list_item}
          button
          selected={props.listSelected}
          onClick={handleListClick}
          style={{ marginBottom: "1rem" }}
        >
          <ListItemIcon>
            <SearchRounded />
          </ListItemIcon>
        </ListItem>
      </Tooltip>

      <Drawer
        className={classes.drawer}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <div className={classes.drawerSubHeader}>
            <Typography
              variant="h5"
              component="p"
              className={classes.drawerTitle}
            >
              Search
            </Typography>

            <IconButton onClick={handleDrawerClose}>
              <ChevronLeft />
            </IconButton>
          </div>
        </div>
        <form onSubmit={deepSearch} style={{ display: "flex" }}>
          <TextField
            autoFocus
            label="Search Notes"
            className={classes.textField}
            style={{ width: "100%" }}
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
            variant="outlined"
            type="text"
            //type ="search" buggs in firefox because we can't have nice things in firefox :(
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    // edge="end"
                    size="small"
                    aria-label="clear"
                    onClick={clearSearch}
                  >
                    <Close />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </form>

        <Divider />

        <List>
          {results
            ? results.map(result => {
                return (
                  <Fragment key={result._id}>
                    <ListItem
                      button
                      onClick={handleTagClick.bind(
                        this,
                        result._id,
                        resultType(result)
                      )}
                    >
                      {result.tagname && (
                        <>
                          <ListItemIcon style={{ minWidth: "3rem" }}>
                            <StyleRounded />
                          </ListItemIcon>
                          <ListItemText
                            primary={result.tagname}
                            secondary={
                              result.notes.filter(note => !note.trash).length +
                              " notes"
                            }
                            primaryTypographyProps={{
                              noWrap: true,
                              component: "p"
                            }}
                          />
                        </>
                      )}
                      {result.name && (
                        <>
                          <ListItemIcon style={{ minWidth: "3rem" }}>
                            <LibraryBooksRounded />
                          </ListItemIcon>
                          <ListItemText
                            primary={result.name}
                            secondary={
                              result.notes.filter(note => !note.trash).length +
                              " notes"
                            }
                            primaryTypographyProps={{
                              noWrap: true,
                              component: "p"
                            }}
                          />
                        </>
                      )}
                      {result.title && (
                        <>
                          <ListItemIcon style={{ minWidth: "3rem" }}>
                            <DescriptionRounded />
                          </ListItemIcon>
                          <ListItemText
                            primary={result.title}
                            secondary={previewText(result.body)}
                            primaryTypographyProps={{
                              noWrap: true,
                              component: "p"
                            }}
                          />
                        </>
                      )}
                    </ListItem>
                    <Divider />
                  </Fragment>
                );
              })
            : "Loading Results..."}
          {search !== "" && results.length === 0 && (
            <Typography variant="body2" gutterBottom style={{ margin: "1rem" }}>
              No results...
            </Typography>
          )}
          {search === "" && (
            <Typography variant="body2" gutterBottom style={{ margin: "1rem" }}>
              Type a query in the search box above and hit the Enter key to
              perform a deep search inside notes.
            </Typography>
          )}
        </List>
      </Drawer>
    </div>
  );
};

export default withRouter(SearchDrawer);
