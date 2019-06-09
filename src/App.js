import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Context from "./context/context";

// import "./App.css";
import Main from "./components/main/main";
import ErrorRoute from "./components/ErrorRoute/errorRoute";
import AuthScreen from "./components/authScreen/authscreen";

import {
  mergeNotes,
  selectNotebook,
  sortByDateNewestFirst
} from "./helpers/helpers";
import {
  fetchUserData,
  createNote,
  createNotebook,
  updateNoteBody,
  trashNote,
  noteFavoriteTrue,
  noteFavoriteFalse,
  moveNote
} from "./helpers/graphQLrequests";

class App extends Component {
  state = {
    token: false,
    userId: null,
    userName: null,
    notebooks: null,
    notes: null,
    activeNote: null,
    activeNotebook: null,
    activeUI: "NOTES"
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

  updateNotes = notes => {
    this.setState({
      notes
    });
  };

  softDeleteNote = noteToTrash => {
    //Send a request to server then :
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
        const newNotebooks = this.state.notebooks.filter(
          notebook => notebook._id !== responseNote.notebook._id
        );
        let updatedNotebook = selectNotebook(
          this.state.notebooks,
          responseNote.notebook._id
        );
        updatedNotebook[0].notes = updatedNotebook[0].notes.map(note =>
          note._id === responseNote._id ? { ...note, trash: true } : note
        );
        newNotebooks.push(updatedNotebook[0]);
        return { responseNote, newNotebooks };
      })
      .then(data => {
        this.setState(prevState => {
          return {
            activeNote:
              prevState.activeNote._id === data.responseNote._id
                ? null
                : prevState.activeNote._id,
            notes: prevState.notes.map(note =>
              note._id === data.responseNote._id
                ? { ...note, trash: true }
                : note
            ),
            notebooks: data.newNotebooks
          };
        });
      });
  };

  moveNoteToNotebook = (noteID, notebookID) => {
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
        const newNotebooks = this.state.notebooks.filter(
          notebook =>
            notebook._id !== responseNote.notebook._id ||
            notebook._id !== notebookID
        );
        //delete the note from the oldnotebook
        //add the note to the newnotebook
        let updatedNotebook = selectNotebook(
          this.state.notebooks,
          responseNote.notebook._id
        );
        // updatedNotebook[0].notes = updatedNotebook[0].notes.map(note =>
        //   note._id === responseNote._id ? { ...note, trash: true } : note
        // );
        updatedNotebook[0].notes.push(responseNote);
        let oldNotebook = selectNotebook(this.state.notebooks, notebookID);
        if (oldNotebook.notes && oldNotebook.notes.length > 0) {
          newNotebooks.push({
            ...oldNotebook.notes.filter(note => note._id !== noteID)
          });
        } else {
          newNotebooks.push(oldNotebook);
        }
        //const newNotebookNotes = responseNote.notebook
        //const newNotebooksNotes add the new note
        // newNotebooks.push(updatedNotebook[0]);
        newNotebooks.push(updatedNotebook[0]);
        return { responseNote, newNotebooks };
      })
      .then(data => {
        this.setState(prevState => {
          return {
            activeNote:
              prevState.activeNote._id === data.responseNote._id
                ? data.responseNote
                : null,
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
    const resName = !note.favorite ? "noteFavoriteTrue" : "noteFavoriteFalse";

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
        const responseNote = r.data[resName];
        console.log(responseNote);
        const newNotebooks = this.state.notebooks.filter(
          notebook => notebook._id !== responseNote.notebook._id
        );
        let updatedNotebook = selectNotebook(
          this.state.notebooks,
          responseNote.notebook._id
        );
        console.log(updatedNotebook[0]);
        updatedNotebook[0].notes = updatedNotebook[0].notes.map(note =>
          note._id === responseNote._id
            ? { ...note, favorite: responseNote.favorite }
            : note
        );
        newNotebooks.push(updatedNotebook[0]);
        return { responseNote, newNotebooks };
      })
      .then(data => {
        this.setState(prevState => {
          return {
            activeNote:
              prevState.activeNote._id === data.responseNote._id
                ? data.responseNote
                : prevState.activeUI,
            notes: prevState.notes.map(note =>
              note._id === data.responseNote._id
                ? { ...note, favorite: data.responseNote.favorite }
                : note
            ),
            notebooks: data.newNotebooks
          };
        });
      });
  };

  setActiveNotebook = notebookId => {
    //can set it to null by passing null
    this.setState({
      activeNotebook: notebookId
    });
  };

  setActiveUI = (ui = "NOTES") => {
    this.setState({
      activeUI: ui
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
        updatedNotebook[0].notes.push(r.data.createNote);
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
      });
  };

  updateNoteBody = (id, body) => {
    const parsedBody = JSON.stringify(JSON.stringify(body));
    // console.log(parsedBody);
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
        console.log(r);
        const updatedNotes = this.state.notes.filter(
          note => note._id !== r.data.updateNoteBody._id
        );
        updatedNotes.push(r.data.updateNoteBody);
        sortByDateNewestFirst(updatedNotes, "updatedAt");
        this.setState({
          notes: updatedNotes
        });
      });
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
        const notebooks = this.state.notebooks;
        notebooks.push(resData.data.createNotebook);
        this.setState({
          notebooks: notebooks
        });
      })
      .catch(err => {
        console.log(err);
      });
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
        this.setState({
          userName: resData.data.user.username,
          notebooks: resData.data.user.notebooks,
          notes: sortByDateNewestFirst(
            mergeNotes(resData.data.user.notebooks),
            "updatedAt"
          )
        });
      })
      .catch(err => {
        console.log(err);
      });
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
            pushNoteToState: this.pushNoteToState,
            updateNoteBody: this.updateNoteBody,
            setActiveUI: this.setActiveUI,
            updateNotes: this.updateNotes,
            softDeleteNote: this.softDeleteNote,
            noteToggleFavorite: this.noteToggleFavorite,
            moveNoteToNotebook: this.moveNoteToNotebook
            // activeUI: this.state.activeUI
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
