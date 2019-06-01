import React from "react";

export default React.createContext({
  token: null,
  userId: null,
  userName: null,
  notes: null,
  activeNote: null,
  activeNotebook: null,
  activeUI: "NOTES",
  login: (token, userId, tokenExpiration) => {},
  logout: () => {},
  fetchUserData: () => {},
  setActiveNote: () => {},
  setActiveNotebook: () => {},
  pushNoteToServer: () => {},
  pushNoteToState: () => {},
  updateNoteBody: () => {},
  createNotebook: () => {},
  setActiveUI: () => {}
});
