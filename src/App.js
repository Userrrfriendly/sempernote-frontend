import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// import "materialize-css/dist/css/materialize.min.css";
// import "./mat.css"; //core styles from materialize-css
// import M from "materialize-css";

import Context from "./context/context";

import "./App.css";
import Nav from "./components/header/nav";
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
  updateNoteBody
} from "./helpers/graphQLrequests";

class App extends Component {
  state = {
    token: false,
    userId: null,
    userName: null,
    notebooks: null,
    notes: null,
    activeNote: null,
    activeNotebook: null
  };

  componentDidMount() {
    // M.AutoInit();
  }

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

  setActiveNotebook = notebookId => {
    this.setState({
      activeNotebook: notebookId
      // activeNotebook: notebookId ? notebookId : null
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
            updateNoteBody: this.updateNoteBody
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
                  <Nav />
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
