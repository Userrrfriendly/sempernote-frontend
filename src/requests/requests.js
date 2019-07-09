// import React, { useContext } from "react";
// import DispatchContext from "../context/DispatchContext";
// import { LOG_IN, FETCH_USER_DATA } from "../context/rootReducer";
import {
  simplifyNotebooks,
  mergeNotes,
  selectNotebook,
  sortByDateNewestFirst,
  filterTrash
} from "../helpers/helpers";
import {
  fetchUserData,
  logIn,
  signUp,
  createNotebook,
  createTag,
  tagFavoriteTrue,
  tagFavoriteFalse,
  notebookDelete,
  notebookRename,
  notebookFavoriteTrue,
  notebookFavoriteFalse,
  updateNoteBody,
  createNote
} from "../helpers/graphQLrequests";
// const dispatch = useContext(DispatchContext);

const url = "http://localhost:8000/graphql";
const options = {
  method: "POST",
  body: "JSON.stringify(requestBody)",
  headers: {
    "Content-Type": "application/json",
    Authorization: `"Bearer " + this.state.token`
  }
};

const logInOptions = {
  method: "POST",
  body: "JSON.stringify(requestBody)",
  headers: {
    "Content-Type": "application/json"
  }
};

/**FETCH USER DATA */
export function fetchUserDataReq(userId) {
  let requestBody = JSON.stringify({
    query: fetchUserData(userId)
  });

  return fetch(url, { ...logInOptions, body: requestBody })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("fetchUserData Request Failed!");
      }
      return res.json();
    })
    .then(resData => {
      console.log(resData);
      const notes = sortByDateNewestFirst(
        mergeNotes(resData.data.user.notebooks),
        "updatedAt"
      );

      const filteredNotes = filterTrash(notes);

      return {
        userName: resData.data.user.username,
        notebooks: simplifyNotebooks(resData.data.user.notebooks),
        tags: resData.data.user.tags,
        notes: filteredNotes.notes,
        trash: filteredNotes.trash
      };
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/***LOG IN ***/
export function logInReq(email, password) {
  const requestBody = JSON.stringify({
    query: logIn(email, password)
  });
  console.log("LOG IN");

  return fetch(url, { ...logInOptions, body: requestBody })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        if (res.status === 500) {
          throw new Error("500" + res.statusText);
        }
        throw new Error("logIn Request Failed!");
      }
      return res.json();
    })
    .then(resData => {
      if (resData.data.login.token) {
        return {
          userId: resData.data.login.userId,
          token: resData.data.login.token
        };
      }
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/*** SIGNUP ***/
export function signUpReq(username, email, password) {
  const requestBody = JSON.stringify({
    query: signUp(username, email, password)
  });

  return fetch(url, { ...logInOptions, body: requestBody })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("signUp Request Failed!");
      }
      return res.json();
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/**CREATE NOTEBOOK **/
export function createNotebookReq(name, token) {
  console.log(`...createing Notebook ${name}`);

  let requestBody = JSON.stringify({
    query: createNotebook(name)
  });
  const auth = "Bearer " + token;
  console.log(auth);
  // var ops = {...options, headers:{...options.headers, Authorization:'test'}}
  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("createNotebook Request Failed!");
      }
      return res.json();
    })
    .then(resJSON => {
      // console.log(resJSON.data.createNotebook);
      return resJSON.data.createNotebook;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/**CREATE TAG */
export function createTagReq(tagname, token) {
  const requestBody = JSON.stringify({
    query: createTag(tagname)
  });
  const auth = "Bearer " + token;

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("createTag Request Failed!");
      }
      return res.json();
    })
    .then(r => {
      return r.data.createTag;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/** TAG TOGGLE FAVORITE**/
export function tagToggleFavoriteReq(tag, token) {
  const query = !tag.favorite ? tagFavoriteTrue : tagFavoriteFalse;
  const responseName = !tag.favorite ? "tagFavoriteTrue" : "tagFavoriteFalse";

  const requestBody = JSON.stringify({
    query: query(tag._id)
  });
  const auth = "Bearer " + token;

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("tagToggleFavorite Request Failed!");
      }
      return res.json();
    })
    .then(r => {
      const responseTag = r.data[responseName];
      return { responseTag };
    })
    .then(data => {
      console.log(data);
      //TOAST HERE TO SIGNAL SUCCESS OR FAILURE
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/*** DELETE NOTEBOOK */
export function notebookDeleteReq(id, token) {
  const query = notebookDelete;

  const requestBody = JSON.stringify({
    query: query(id)
  });
  const auth = "Bearer " + token;

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("NotebookDelete Request Failed!");
      }
      return res.json();
    })
    .then(r => {
      console.log(r);
      if (r.data) {
        return r.data.notebookDelete;
      }
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/** RENAME NOTEBOOK */
export function notebookRenameReq(notebookID, name, token) {
  const query = notebookRename;
  const auth = "Bearer " + token;

  const requestBody = JSON.stringify({
    query: query(notebookID, name)
  });

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("RenameNotebook Request Failed!");
      }
      return res.json();
    })
    .then(resJSON => {
      return resJSON.data.notebookRename;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/** NOTEBOOK TOGGLE FAVORITE **/
export function notebookToggleFavoriteReq(notebook, token) {
  const query = !notebook.favorite
    ? notebookFavoriteTrue
    : notebookFavoriteFalse;
  const responseName = !notebook.favorite
    ? "notebookFavoriteTrue"
    : "notebookFavoriteFalse";

  const requestBody = JSON.stringify({
    query: query(notebook._id)
  });
  const auth = "Bearer " + token;

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      return res.json();
    })
    .then(r => {
      return r.data[responseName];
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/** NOTES **/
/** UPDATE NOTE BODY */
export function updateNoteBodyReq(id, body, token) {
  const auth = "Bearer " + token;

  const parsedBody = JSON.stringify(JSON.stringify(body));
  const requestBody = JSON.stringify({
    query: updateNoteBody(id, parsedBody)
  });

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("updateNoteBody Request Failed!");
      }
      return res.json();
    })
    .then(resJSON => {
      // console.log(resJSON.data.updateNoteBody);
      return resJSON.data.updateNoteBody;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/**PUSH NEW NOTE TO SERVER */
// export function updateNoteBodyReq(id, body, token) {
//   const auth = "Bearer " + token;

//   const parsedBody = JSON.stringify(JSON.stringify(body));
//   const requestBody = JSON.stringify({
//     query: updateNoteBody(id, parsedBody)
//   });

//   return fetch(url, {
//     ...options,
//     body: requestBody,
//     headers: { ...options.headers, Authorization: auth }
//   })

export function pushNoteToServerReq(note, token) {
  console.log(`pushing note: ${note.title} to server`);
  const auth = "Bearer " + token;

  const title = note.title;
  const body = JSON.stringify(note.body);
  const notebook = note.notebook._id;
  const requestBody = JSON.stringify({
    query: createNote(title, body, notebook)
  });

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("pushNoteToServer Request Failed!");
      }
      return res.json();
    })
    .then(r => {
      console.log(r);
      return r.data.createNote;
      // const newNotebooks = this.state.notebooks.filter(
      //   notebook => notebook._id !== r.data.createNote.notebook._id
      // );
      // let updatedNotebook = selectNotebook(
      //   this.state.notebooks,
      //   r.data.createNote.notebook._id
      // );
      // // updatedNotebook[0].notes.push(r.data.createNote);
      // updatedNotebook[0].notes.push({
      //   _id: r.data.createNote._id,
      //   title: r.data.createNote.title
      // });
      // newNotebooks.push(updatedNotebook[0]);
      // let updatedNotes = this.state.notes.filter(
      //   note => !note.hasOwnProperty("temp")
      // );
      // updatedNotes.push(r.data.createNote);
      // sortByDateNewestFirst(updatedNotes, "updatedAt");
      // this.setState({
      //   notebooks: newNotebooks,
      //   notes: updatedNotes,
      //   activeNote: r.data.createNote //this will trigger a re-render on editor and probably break things
      // });
    })
    .catch(err => console.log(err));
}
