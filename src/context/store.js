import React, { useReducer } from "react";

// import { useImmerReducer } from "use-immer";

import rootReducer from "./rootReducer";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// import { createNotebookReq } from "../requests/requests";

export default function Store(props) {
  const initialState = {
    token: null,
    userId: null,
    userName: null,
    notes: null,
    // filteredNotes: null, //delete
    noteFilter: { name: "ALL_NOTES" },
    trash: null,
    activeNote: null,
    activeNotebook: null,
    tags: null,
    // login: (token, userId, tokenExpiration) => {},
    // logout: () => {},
    // fetchUserData: () => {},
    setActiveNote: () => {},
    setActiveNotebook: () => {},
    pushNoteToServer: () => {},
    pushNoteToState: () => {},
    // updateNoteBody: () => {},
    // createNotebook: name => {
    //   createNotebookReq(name, state.token).then(r => {
    //     console.log(state);
    //     console.log(r);
    //   });
    // },
    notebookToggleFavorite: () => {},
    // notebookRename: () => {},
    // notebookDelete: () => {},
    updateNotes: () => {},
    softDeleteNote: () => {},
    noteToggleFavorite: () => {},
    moveNote: () => {},
    renameNote: () => {},
    // setFilteredNotes: () => {}, //delete or change
    setNoteFilter: () => {},
    createTag: () => {},
    tagToggleFavorite: () => {} //rename this
  };

  const [state, dispatch] = useReducer(rootReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}
