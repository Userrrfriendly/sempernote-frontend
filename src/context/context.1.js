import React from "react";

export default React.createContext({
  token: null,
  userId: null,
  userName: null,
  notes: null,
  filteredNotes: null, //delete
  noteFilter: null,
  trash: null,
  activeNote: null,
  activeNotebook: null,
  // activeUI: "NOTES", //delete or change
  tags: null,
  login: (token, userId, tokenExpiration) => {},
  logout: () => {},
  fetchUserData: () => {},
  setActiveNote: () => {},
  setActiveNotebook: () => {},
  pushNoteToServer: () => {},
  pushNoteToState: () => {},
  updateNoteBody: () => {},
  createNotebook: () => {},
  notebookToggleFavorite: () => {},
  notebookRename: () => {},
  notebookDelete: () => {},
  updateNotes: () => {},
  softDeleteNote: () => {},
  noteToggleFavorite: () => {},
  moveNote: () => {},
  renameNote: () => {},
  setFilteredNotes: () => {}, //delete or change
  setNoteFilter: () => {},
  createTag: () => {},
  tagToggleFavorite: () => {} //rename this
});