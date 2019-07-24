import React, { useReducer } from "react";

import rootReducer from "./rootReducer";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

export default function Store(props) {
  const initialState = {
    token: null,
    userId: null,
    userName: null,
    notes: null,
    noteFilter: { name: "ALL_NOTES" },
    trash: null,
    activeNote: null,
    defaultNotebook: null,
    tags: null
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
