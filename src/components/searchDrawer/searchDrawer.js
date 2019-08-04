import React, { useEffect, useState, useContext, Fragment } from "react";
import { withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import Delta from "quill-delta";
import { includes as _includes } from "lodash";

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
import DispatchContext from "../../context/DispatchContext";
import StateContext from "../../context/StateContext";
import { SET_NOTE_FILTER, SET_ACTIVE_NOTE } from "../../context/rootReducer";
import { NOTEBOOK, NOTES, TAG } from "../../context/activeUItypes";
import { deltaToPlainText } from "../../helpers/helpers";
import { useScreenSize } from "../../helpers/useScreenSize";

const SearchDrawer = props => {
  const scrSize = useScreenSize();
  const drawerWidth = scrSize ? 400 : "75vw";

  const useStyles = makeStyles(theme => ({
    root: {
      display: "flex"
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
    drawerPaperSm: {
      width: drawerWidth,
      left: "0",
      overflowX: "hidden"
    },
    drawerHeader: {
      display: "flex",
      padding: "0 8px",
      ...theme.mixins.toolbar,
      justifyContent: "space-between",
      flexDirection: "column"
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
    }
  }));

  const appState = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const classes = useStyles();

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

  const handleResultItemClick = (resultID, resultType) => {
    props.toggleDrawer();
    switch (resultType) {
      case TAG:
        dispatch({
          type: SET_NOTE_FILTER,
          name: TAG,
          options: resultID
        });
        break;
      case NOTEBOOK:
        dispatch({
          type: SET_NOTE_FILTER,
          name: NOTEBOOK,
          options: resultID
        });
        break;
      case NOTES:
        dispatch({
          type: SET_NOTE_FILTER,
          name: NOTES
        });
        dispatch({
          type: SET_ACTIVE_NOTE,
          name: NOTES,
          _id: resultID
        });
        let path = `/main/editor`;
        props.history.push(path);
        break;
      default:
        break;
    }
  };

  const deepSearch = e => {
    e.preventDefault();
    const deepSearch = appState.notes.filter(note => {
      const parsedDelta = new Delta(JSON.parse(note.body));
      const plainText = deltaToPlainText(parsedDelta);

      return plainText.toLowerCase().includes(search.toLowerCase());
    });

    const noteTitleSearch = appState.notes.filter(
      note =>
        note.title.toLowerCase().includes(search.toLowerCase()) &&
        !_includes(deepSearch, note)
      //compares results with deepsearch to avoid duplicates
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
      const filteredNotes = appState.notes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase())
      );
      const filteredNotebooks = appState.notebooks.filter(notebook =>
        notebook.name.toLowerCase().includes(search.toLowerCase())
      );
      const filteredTags = appState.tags.filter(tag =>
        tag.tagname.toLowerCase().includes(search.toLowerCase())
      );

      const filteredResults = filteredNotes.concat(
        filteredNotebooks,
        filteredTags
      );

      setResults(filteredResults);
    }
  }, [search, appState.tags, appState.notebooks, appState.notes]);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className={classes.root}>
      <Tooltip title="Search" placement="right">
        <ListItem
          className={classes.list_item}
          button
          selected={props.listSelected}
          onClick={props.toggleDrawer.bind(this, "search", true)}
          style={{ marginBottom: "1rem" }}
        >
          <ListItemIcon>
            <SearchRounded />
          </ListItemIcon>
          {!scrSize && <ListItemText primary="Search" />}
        </ListItem>
      </Tooltip>

      <Drawer
        className={classes.drawer}
        anchor="left"
        open={props.drawerState.search}
        onClose={props.toggleDrawer.bind(this, "search", false)}
        classes={{
          paper: scrSize ? classes.drawerPaper : classes.drawerPaperSm
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

            <IconButton
              onClick={props.toggleDrawer.bind(this, "search", false)}
            >
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
                      onClick={handleResultItemClick.bind(
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
