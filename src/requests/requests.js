// import React, { useContext } from "react";
// import DispatchContext from "../context/DispatchContext";
// import { LOG_IN, FETCH_USER_DATA } from "../context/rootReducer";
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
  createNotebook
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
    });
}

//
export function createNotebookReq(name, token) {
  console.log(`...createing Notebook ${name}`);
  console.log(token);

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
    });
}
