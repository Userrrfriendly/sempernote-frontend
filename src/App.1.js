import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Context from "./context/context";

// import "./App.css";
import Main from "./components/main/main";
import ErrorRoute from "./components/ErrorRoute/errorRoute";
import AuthScreen from "./components/authScreen/authscreen";

import {
  simplifyNotebooks,
  mergeNotes,
  selectNotebook,
  sortByDateNewestFirst,
  filterTrash
} from "./helpers/helpers";
import {
  fetchUserData,
  createNote,
  notebookFavoriteTrue,
  notebookFavoriteFalse,
  notebookRename,
  createNotebook,
  updateNoteBody,
  trashNote,
  noteFavoriteTrue,
  noteFavoriteFalse,
  renameNote,
  moveNote,
  createTag,
  assignTag,
  unAssignTag,
  tagFavoriteTrue,
  tagFavoriteFalse,
  notebookDelete
} from "./helpers/graphQLrequests";

// import { find as _find } from "lodash";
// import { filter as _filter } from "lodash";

class App extends Component {
  state = {
    token: false,
    userId: null,
    userName: null,
    notebooks: null,
    notes: null,
    filteredNotes: null,
    noteFilter: { name: "ALL_NOTES" },
    trash: null,
    tags: null,
    activeNote: null,
    activeNotebook: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  setActiveNote = noteId => {
    const activeNote = this.state.notes.find(note => note._id === noteId);
    this.setState({
      activeNote: activeNote ? activeNote : null
    });
  };

  setFilteredNotes = notes => {
    this.setState({
      filteredNotes: notes
    });
  };

  setNoteFilter = (name, options) => {
    this.setState({
      noteFilter: { name, options }
    });
  };

  //for now used only in sorting notes !!! Probably can depricate it and replace with filtered notes
  updateNotes = notes => {
    this.setState({
      notes
    });
  };

  softDeleteNote = noteToTrash => {
    const requestBody = {
      query: trashNote(noteToTrash._id)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const responseNote = r.data.softDeleteNote;

        return { responseNote };
      })
      .then(data => {
        const tags = this.state.tags.map(tag => {
          return {
            ...tag,
            notes: tag.notes.map(note =>
              note._id === data.responseNote._id
                ? {
                    _id: data.responseNote._id,
                    title: data.responseNote.title,
                    trash: data.responseNote.trash
                  }
                : note
            )
          };
        });
        console.log(tags);
        this.setState(prevState => {
          return {
            activeNote:
              prevState.activeNote &&
              prevState.activeNote._id === data.responseNote._id
                ? null
                : prevState.activeNote,
            notes: prevState.notes.filter(
              note => note._id !== data.responseNote._id
            ),
            trash: prevState.trash.concat(data.responseNote),
            tags: tags
            // ,notebooks: data.newNotebooks
          };
        });
      });
  };

  moveNoteToNotebook = (noteID, notebookID, oldNotebookID) => {
    //Send a request to server then :
    const requestBody = {
      query: moveNote(noteID, notebookID)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const responseNote = r.data.moveNote;
        console.log(this.state.notebooks);
        const newNotebooks = this.state.notebooks.filter(
          notebook =>
            notebook._id !== oldNotebookID && notebook._id !== notebookID
        );
        // console.log(responseNote.notebook._id, notebookID, oldNotebookID);
        console.log(newNotebooks);

        //delete the note from the oldnotebook
        //add the note to the newnotebook
        let updatedNotebook = selectNotebook(this.state.notebooks, notebookID);
        updatedNotebook[0].notes.push(responseNote);
        let oldNotebook = selectNotebook(this.state.notebooks, oldNotebookID);
        oldNotebook[0].notes = oldNotebook[0].notes.filter(
          note => note._id !== noteID
        );
        console.log(oldNotebook);
        console.log("newNotebooks:");
        console.log(newNotebooks);
        console.log(updatedNotebook[0]);
        newNotebooks.push(updatedNotebook[0], oldNotebook[0]);
        return { responseNote, newNotebooks };
      })
      .then(data => {
        console.log(data.responseNote, data.newNotebooks);
        const activeNote =
          this.state.activeNote._id === data.responseNote._id
            ? data.responseNote
            : this.state.activeNote;

        this.setState(prevState => {
          return {
            activeNote: activeNote,
            notes: prevState.notes.map(note =>
              note._id === data.responseNote._id ? data.responseNote : note
            ),
            notebooks: data.newNotebooks
          };
        });
        console.log("note moved");
      })
      .catch(err => console.log(err));
  };

  noteToggleFavorite = note => {
    //toggle favorite-> favorite:!value
    //change color on icon (initially mannually when the theme is added just change it through theme)
    //send req to server if fail raise a toast
    const query = !note.favorite ? noteFavoriteTrue : noteFavoriteFalse;
    const responseName = !note.favorite
      ? "noteFavoriteTrue"
      : "noteFavoriteFalse";

    const requestBody = {
      query: query(note._id)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const responseNote = r.data[responseName];
        console.log(responseNote);
        return { responseNote };
      })
      .then(data => {
        this.setState(prevState => {
          return {
            activeNote:
              prevState.activeNote &&
              prevState.activeNote._id === data.responseNote._id
                ? data.responseNote
                : prevState.activeNote,
            notes: prevState.notes.map(note =>
              note._id === data.responseNote._id
                ? { ...note, favorite: data.responseNote.favorite }
                : note
            )
          };
        });
      })
      .catch(err => console.log(err));
  };

  renameNote = (noteID, newTitle) => {
    const query = renameNote;

    const requestBody = {
      query: query(noteID, newTitle)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const responseNote = r.data.renameNote;
        console.log(responseNote);
        return { responseNote };
      })
      .then(data => {
        this.setState(prevState => {
          return {
            activeNote:
              prevState.activeNote &&
              prevState.activeNote._id === data.responseNote._id
                ? data.responseNote
                : prevState.activeNote,
            notes: prevState.notes.map(note =>
              note._id === data.responseNote._id
                ? { ...note, title: data.responseNote.title }
                : note
            )
          };
        });
      })
      .catch(err => console.log(err));
  };

  setActiveNotebook = notebookId => {
    //can set it to null by passing null
    this.setState({
      activeNotebook: notebookId
    });
  };

  pushNoteToState = note => {
    let newNotes = this.state.notes;
    newNotes.push(note);
    sortByDateNewestFirst(newNotes, "updatedAt");
    this.setState({
      notes: newNotes
    });
  };

  pushNoteToServer = note => {
    console.log(`pushing note: ${note.title} to server`);

    const title = note.title;
    //JSON.stringify(JSON.strignigy(delta))
    const body = JSON.stringify(note.body);
    const notebook = note.notebook._id;
    const requestBody = {
      query: createNote(title, body, notebook)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const newNotebooks = this.state.notebooks.filter(
          notebook => notebook._id !== r.data.createNote.notebook._id
        );
        let updatedNotebook = selectNotebook(
          this.state.notebooks,
          r.data.createNote.notebook._id
        );
        // updatedNotebook[0].notes.push(r.data.createNote);
        updatedNotebook[0].notes.push({
          _id: r.data.createNote._id,
          title: r.data.createNote.title
        });
        newNotebooks.push(updatedNotebook[0]);
        let updatedNotes = this.state.notes.filter(
          note => !note.hasOwnProperty("temp")
        );
        updatedNotes.push(r.data.createNote);
        sortByDateNewestFirst(updatedNotes, "updatedAt");
        this.setState({
          notebooks: newNotebooks,
          notes: updatedNotes,
          activeNote: r.data.createNote //this will trigger a re-render on editor and probably break things
        });
      })
      .catch(err => console.log(err));
  };

  updateNoteBody = (id, body) => {
    const parsedBody = JSON.stringify(JSON.stringify(body));
    const requestBody = {
      query: updateNoteBody(id, parsedBody)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const updatedNotes = this.state.notes.filter(
          note => note._id !== r.data.updateNoteBody._id
        );
        updatedNotes.push(r.data.updateNoteBody);
        sortByDateNewestFirst(updatedNotes, "updatedAt");
        let activeNote;
        if (this.state.activeNote) {
          activeNote =
            this.state.activeNote._id === r.data.updateNoteBody._id
              ? r.data.updateNoteBody
              : this.state.activeNote;
        }
        this.setState({
          notes: updatedNotes,
          activeNote: activeNote
        });
      })
      .catch(err => console.log(err));
  };

  createNotebook = name => {
    console.log(`...createing Notebook ${name}`);
    let requestBody = {
      query: createNotebook(name)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData.data.createNotebook);
        // const notebooks = this.state.notebooks;
        const notebooks = [...this.state.notebooks];
        notebooks.push(resData.data.createNotebook);
        this.setState({
          notebooks: notebooks
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  notebookToggleFavorite = notebookID => {
    const notebook = this.state.notebooks.filter(
      book => book._id === notebookID
    )[0];

    //toggle favorite-> favorite:!value
    //change color on icon (initially mannually when the theme is added just change it through theme)
    //send req to server if fail raise a toast
    const query = !notebook.favorite
      ? notebookFavoriteTrue
      : notebookFavoriteFalse;
    const responseName = !notebook.favorite
      ? "notebookFavoriteTrue"
      : "notebookFavoriteFalse";

    const requestBody = {
      query: query(notebook._id)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const responseNotebook = r.data[responseName];
        console.log(responseNotebook);
        return { responseNotebook };
      })
      .then(data => {
        this.setState(prevState => {
          return {
            activeNote:
              prevState.activeNote &&
              prevState.activeNote._id === data.responseNotebook._id
                ? data.responseNote
                : prevState.activeNote,
            notes: prevState.notes.map(note =>
              note.notebook._id === data.responseNotebook._id
                ? { ...note, notebook: data.responseNotebook }
                : note
            ),
            notebooks: prevState.notebooks.map(notebook =>
              notebook._id === data.responseNotebook._id
                ? data.responseNotebook
                : notebook
            )
          };
        });
      })
      .catch(err => console.log(err));
  };

  notebookRename = (notebookID, name) => {
    const query = notebookRename;

    const requestBody = {
      query: query(notebookID, name)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const responseNotebook = r.data.notebookRename;
        console.log(responseNotebook);
        return { responseNotebook };
      })
      .then(data => {
        this.setState(prevState => {
          return {
            activeNote:
              prevState.activeNote &&
              prevState.activeNote._id === data.responseNotebook._id
                ? data.responseNote
                : prevState.activeNote,
            notes: prevState.notes.map(note =>
              note.notebook._id === data.responseNotebook._id
                ? { ...note, notebook: data.responseNotebook }
                : note
            ),
            notebooks: prevState.notebooks.map(notebook =>
              notebook._id === data.responseNotebook._id
                ? data.responseNotebook
                : notebook
            )
          };
        });
      })
      .catch(err => console.log(err));
  };

  notebookDelete = ID => {
    const query = notebookDelete;

    const requestBody = {
      query: query(ID)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const responseNotebook = r.data.notebookDelete;
        // console.log(responseNotebook);
        return { responseNotebook };
      })
      .then(data => {
        this.setState(prevState => {
          return {
            activeNote:
              prevState.activeNote &&
              prevState.activeNote._id === data.responseNotebook._id
                ? null
                : prevState.activeNote,
            notes: prevState.notes.filter(
              note => note.notebook._id !== data.responseNotebook._id
            ),
            notebooks: prevState.notebooks.filter(
              notebook => notebook._id !== data.responseNotebook._id
            )
          };
        });
      })
      .catch(err => console.log(err));
  };

  fetchUserData = () => {
    let requestBody = {
      query: fetchUserData(this.state.userId)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        // console.log(resData);
        const notes = sortByDateNewestFirst(
          mergeNotes(resData.data.user.notebooks),
          "updatedAt"
        );

        const filteredNotes = filterTrash(notes);
        this.setState({
          userName: resData.data.user.username,
          notebooks: simplifyNotebooks(resData.data.user.notebooks),
          tags: resData.data.user.tags,
          notes: filteredNotes.notes,
          trash: filteredNotes.trash
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  /** TAGS **/
  createTag = tagID => {
    //Send a request to server then :
    const requestBody = {
      query: createTag(tagID)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const newTag = r.data.createTag;
        console.log(newTag);
        this.setState(prevState => {
          return { tags: prevState.tags.concat(newTag) };
        });
      })
      .catch(err => console.log(err));
  };

  assignTag = (tagID, noteID) => {
    const requestBody = {
      query: assignTag(tagID, noteID)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const assignedTag = r.data.assignTag;
        const modifiedNote = this.state.notes.filter(
          note => note._id === noteID
        );
        console.log(this.state.notes);
        console.log(modifiedNote[0]);
        console.log({
          _id: assignedTag._id,
          tagname: assignedTag.tagname
        });
        modifiedNote[0].tags = modifiedNote[0].tags.concat({
          _id: assignedTag._id,
          tagname: assignedTag.tagname
        });
        const activeNote =
          this.state.activeNote._id === modifiedNote._id
            ? modifiedNote
            : this.state.activeNote;
        console.log(activeNote);
        console.log(assignedTag);
        this.setState(prevState => {
          return {
            tags: prevState.tags.map(tag =>
              tag._id === assignedTag._id ? assignedTag : tag
            ),
            notes: prevState.notes.map(note =>
              note._id === noteID ? modifiedNote[0] : note
            ),
            activeNote: activeNote
          };
        });
      })
      .catch(err => console.log(err));
  };

  unAssignTag = (tagID, noteID) => {
    const requestBody = {
      query: unAssignTag(tagID, noteID)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        console.log(r);
        const unAssignedTag = r.data.unAssignTag;
        const modifiedNote = this.state.notes.filter(
          note => note._id === noteID
        );
        modifiedNote[0].tags = modifiedNote[0].tags.filter(
          tag => tag._id !== unAssignedTag._id
        );

        this.setState(prevState => {
          return {
            tags: prevState.tags.map(tag =>
              tag._id === unAssignedTag._id ? unAssignedTag : tag
            ),
            notes: prevState.notes.map(note =>
              note._id === noteID ? modifiedNote[0] : note
            )
          };
        });
      })
      .catch(err => console.log(err));
  };

  tagToggleFavorite = tagID => {
    const tag = this.state.tags.filter(tag => tag._id === tagID)[0];
    console.log(tag);
    //toggle favorite-> favorite:!value
    //change color on icon (initially mannually when the theme is added just change it through theme)
    //send req to server if fail raise a toast
    const query = !tag.favorite ? tagFavoriteTrue : tagFavoriteFalse;
    const responseName = !tag.favorite ? "tagFavoriteTrue" : "tagFavoriteFalse";

    const requestBody = {
      query: query(tag._id)
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(r => {
        const responseTag = r.data[responseName];
        console.log(responseTag);
        return { responseTag };
      })
      .then(data => {
        console.log(data);
        this.setState(prevState => {
          return {
            activeNote:
              prevState.activeNote &&
              prevState.activeNote._id === data.responseNote._id
                ? data.responseNote
                : prevState.activeNote,

            tags: prevState.tags.map(tag =>
              tag._id === data.responseTag._id
                ? { ...tag, favorite: data.responseTag.favorite }
                : tag
            )
          };
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="App">
        <Context.Provider
          value={{
            ...this.state,
            login: this.login,
            logout: this.logout,
            fetchUserData: this.fetchUserData,
            setActiveNote: this.setActiveNote,
            setActiveNotebook: this.setActiveNotebook,
            pushNoteToServer: this.pushNoteToServer,
            createNotebook: this.createNotebook,
            notebookToggleFavorite: this.notebookToggleFavorite,
            pushNoteToState: this.pushNoteToState,
            updateNoteBody: this.updateNoteBody,
            updateNotes: this.updateNotes,
            softDeleteNote: this.softDeleteNote,
            noteToggleFavorite: this.noteToggleFavorite,
            moveNoteToNotebook: this.moveNoteToNotebook,
            renameNote: this.renameNote,
            createTag: this.createTag,
            assignTag: this.assignTag,
            unAssignTag: this.unAssignTag,
            tagToggleFavorite: this.tagToggleFavorite,
            setFilteredNotes: this.setFilteredNotes,
            setNoteFilter: this.setNoteFilter,
            notebookRename: this.notebookRename,
            notebookDelete: this.notebookDelete
          }}
        >
          <Switch>
            {!this.state.token && <Redirect exact from="/" to="/auth/" />}
            {!this.state.token && <Redirect from="/main/" to="/auth/" />}
            {this.state.token && <Redirect exact from="/auth/" to="/main/" />}
            <Route path="/auth" component={AuthScreen} />
            <Route
              // exact
              path="/main/"
              render={props => (
                <>
                  {/* <Nav /> */}
                  <Main />
                </>
              )}
            />
            <Route component={ErrorRoute} />
          </Switch>
        </Context.Provider>
      </div>
    );
  }
}

export default App;