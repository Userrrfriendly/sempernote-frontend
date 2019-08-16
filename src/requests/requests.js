import {
  simplifyNotebooks,
  mergeNotes,
  // selectNotebook,
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
  createNote,
  moveNote,
  assignTag,
  unAssignTag,
  noteFavoriteTrue,
  noteFavoriteFalse,
  trashNote,
  renameNote,
  renameTag,
  deleteTag,
  restoreNote,
  deleteNoteForever
} from "../helpers/graphQLrequests";

// const url = "https://sempertest.herokuapp.com/graphql";

const url =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:8000/graphql"
    : "https://sempertest.herokuapp.com/graphql";

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
export function fetchUserDataReq(userId, token) {
  let requestBody = JSON.stringify({
    query: fetchUserData(userId)
  });
  const auth = "Bearer " + token;

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("fetchUserData Request Failed!");
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

      return {
        userName: resData.data.user.username,
        notebooks: simplifyNotebooks(resData.data.user.notebooks),
        tags: resData.data.user.tags,
        notes: filteredNotes.notes,
        trash: filteredNotes.trash,
        defaultNotebook: resData.data.user.defaultNotebook
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
  // console.log(auth);
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

/***ASSIGNTAG TO NOTE ***/
export function assignTagReq(tagID, noteID, token) {
  const requestBody = JSON.stringify({
    query: assignTag(tagID, noteID)
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
      const assignedTag = r.data.assignTag;
      return assignedTag;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/***UNASSIGN TAG TO NOTE ***/
export function unAssignTagReq(tagID, noteID, token) {
  const requestBody = JSON.stringify({
    query: unAssignTag(tagID, noteID)
  });
  const auth = "Bearer " + token;

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("unAssignTag Request Failed!");
      }
      return res.json();
    })
    .then(r => {
      return r.data.unAssignTag;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/** RENAME TAG */
export function renameTagReq(tagID, newTagName, token) {
  const requestBody = JSON.stringify({
    query: renameTag(tagID, newTagName)
  });
  const auth = "Bearer " + token;

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("rename Tag  Request Failed!");
      }
      return res.json();
    })
    .then(r => {
      return r.data.renameTag;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/** DELETE TAG */
export function deleteTagReq(tagID, token) {
  const requestBody = JSON.stringify({
    query: deleteTag(tagID)
  });
  const auth = "Bearer " + token;

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Delete Tag  Request Failed!");
      }
      return res.json();
    })
    .then(r => {
      return r.data.deleteTag;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/*** DELETE NOTEBOOK */
export function notebookDeleteReq(id, token) {
  // const query = notebookDelete;

  const requestBody = JSON.stringify({
    query: notebookDelete(id)
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
      return resJSON.data.updateNoteBody;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/**PUSH NEW NOTE TO SERVER */
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
    })
    .catch(err => console.log(err));
}

/** MOVE NOTE TO A NOTEBOOK **/
export function moveNoteToNotebookReq(noteID, notebookID, token) {
  const requestBody = JSON.stringify({
    query: moveNote(noteID, notebookID)
  });
  const auth = "Bearer " + token;

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("moveNoteToNotebook Request Failed!");
      }
      return res.json();
    })
    .then(r => {
      return r.data.moveNote;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/**MOVE NOTE TO TRASH */
export function trashNoteReq(noteToTrash, token) {
  const auth = "Bearer " + token;

  const requestBody = JSON.stringify({
    query: trashNote(noteToTrash._id)
  });

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
      const responseNote = r.data.softDeleteNote;

      return { responseNote };
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/** RESTORE NOTE */
export function restoreNoteReq(noteToTrash, token) {
  const auth = "Bearer " + token;
  const requestBody = JSON.stringify({
    query: restoreNote(noteToTrash._id)
  });

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
      const responseNote = r.data.restoreNote;
      return { responseNote };
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/**PERMANENT DELETE NOTE */
export function deleteNoteForeverReq(note, token) {
  const auth = "Bearer " + token;
  const requestBody = JSON.stringify({
    query: deleteNoteForever(note._id)
  });

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
      const responseNote = r.data.deleteNoteForever;
      return { responseNote };
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/** NOTE TOGGLE FAVORITE TRUE **/
export function noteFavoriteTrueReq(note, token) {
  const query = noteFavoriteTrue;
  const auth = "Bearer " + token;

  const requestBody = JSON.stringify({
    query: query(note._id)
  });

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("noteFavoriteTrue Request Failed!");
      }
      return res.json();
    })
    .then(r => {
      const responseNote = r.data.noteFavoriteTrue;
      return { responseNote };
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/** NOTE TOGGLE FAVORITE FALSE **/
export function noteFavoriteFalseReq(note, token) {
  const query = noteFavoriteFalse;
  const auth = "Bearer " + token;

  const requestBody = JSON.stringify({
    query: query(note._id)
  });

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("noteFavoriteFalse Request Failed!");
      }
      return res.json();
    })
    .then(r => {
      const responseNote = r.data.noteFavoriteFalse;
      console.log(responseNote);
      return { responseNote };
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}

/** RENAME NOTE**/
export function renameNoteReq(noteID, newTitle, token) {
  const auth = "Bearer " + token;
  const requestBody = JSON.stringify({
    query: renameNote(noteID, newTitle)
  });

  return fetch(url, {
    ...options,
    body: requestBody,
    headers: { ...options.headers, Authorization: auth }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("renameNote Request Failed!");
      }
      return res.json();
    })
    .then(r => {
      const responseNote = r.data.renameNote;
      // console.log(responseNote);
      return { responseNote };
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}
