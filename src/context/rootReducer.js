import { sortByDateNewestFirst } from "../helpers/helpers";

export const LOG_IN = "LOG_IN";
export const FETCH_USER_DATA = "FETCH_USER_DATA";
export const CREATE_NOTEBOOK = "CREATE_NOTEBOOK";
export const CREATE_TAG = "CREATE_TAG";
export const TAG_TOGGLE_FAVORITE = "TAG_TOGGLE_FAVORITE";
export const DELETE_NOTEBOOK = "DELETE_NOTEBOOK";
export const RENAME_NOTEBOOK = "RENAME_NOTEBOOK";
export const NOTEBOOK_TOGGLE_FAVORITE = "NOTEBOOK_TOGGLE_FAVORITE";
export const SET_ACTIVE_NOTE = "SET_ACTIVE_NOTE";
export const UPDATE_NOTE_BODY = "UPDATE_NOTE_BODY";

const logIn = (token, userId, state) => {
  return { ...state, token: token, userId: userId };
};

const fetchUserData = (action, state) => {
  return {
    ...state,
    userName: action.userName,
    notebooks: action.notebooks,
    tags: action.tags,
    notes: action.notes,
    trash: action.trash
  };
};
/** NOTEBOOKS **/
const createNotebook = (action, state) => {
  const notebooks = [...state.notebooks];
  notebooks.push(action.notebook);
  return {
    ...state,
    notebooks
  };
};

const deleteNotebook = (action, state) => {
  const activeNote =
    state.activeNote && state.activeNote._id === action._id
      ? null
      : state.activeNote;
  const notes = state.notes.filter(note => note.notebook._id !== action._id);
  const notebooks = state.notebooks.filter(
    notebook => notebook._id !== action._id
  );

  return { ...state, activeNote, notes, notebooks };
};

const renameNotebook = (action, state) => {
  const activeNote =
    state.activeNote && state.activeNote._id === action._id
      ? action.notebook
      : state.activeNote;
  const notes = state.notes.map(note =>
    note.notebook._id === action.notebook._id
      ? { ...note, notebook: { ...note.notebook, name: action.notebook.name } }
      : note
  );
  const notebooks = state.notebooks.map(notebook =>
    notebook._id === action.notebook._id ? action.notebook : notebook
  );
  return { ...state, notes, activeNote, notebooks };
};

const notebookToggleFavorite = (action, state) => {
  const activeNote =
    state.activeNote && state.activeNote._id === action.notebook._id
      ? action.notebook
      : state.activeNote;
  const notes = state.notes.map(note =>
    note.notebook._id === action.notebook._id
      ? {
          ...note,
          notebook: { ...state.notebook, favorite: !action.notebook.favorite }
        }
      : note
  );
  const notebooks = state.notebooks.map(notebook =>
    notebook._id === action.notebook._id
      ? { ...action.notebook, favorite: !action.notebook.favorite }
      : notebook
  );
  return { ...state, activeNote, notes, notebooks };
};

/** NOTES **/
const setActiveNote = (action, state) => {
  const activeNote = state.notes.find(note => note._id === action._id);
  return { ...state, activeNote };
};

const updateNoteBody = (action, state) => {
  const updatedNotes = state.notes.filter(note => note._id !== action.note._id);
  updatedNotes.push(action.note);
  sortByDateNewestFirst(updatedNotes, "updatedAt");
  let activeNote;
  if (state.activeNote) {
    activeNote =
      state.activeNote._id === action.note._id ? action.note : state.activeNote;
  }
  return { ...state, notes: updatedNotes, activeNote };
};

/** TAGS **/
const createTag = (action, state) => {
  const tags = [...state.tags];
  tags.push(action.tag);
  return { ...state, tags };
};

const tagToggleFavorite = (action, state) => {
  const tags = state.tags.map(tag => {
    return tag._id === action.tag._id
      ? { ...tag, favorite: !tag.favorite }
      : tag;
  });
  return { ...state, tags };
};

export const rootReducer = (state, action) => {
  switch (action.type) {
    case LOG_IN:
      console.log(action);
      return logIn(action.token, action.userId, state);
    case FETCH_USER_DATA:
      console.log(action);
      return fetchUserData(action, state);
    case CREATE_NOTEBOOK:
      console.log(action);
      return createNotebook(action, state);
    case CREATE_TAG:
      console.log(action);
      return createTag(action, state);
    case TAG_TOGGLE_FAVORITE:
      console.log(action);
      return tagToggleFavorite(action, state);
    case DELETE_NOTEBOOK:
      console.log(action);
      return deleteNotebook(action, state);
    case RENAME_NOTEBOOK:
      console.log(action);
      return renameNotebook(action, state);
    case NOTEBOOK_TOGGLE_FAVORITE:
      console.log(action);
      return notebookToggleFavorite(action, state);
    case SET_ACTIVE_NOTE:
      console.log(action);
      return setActiveNote(action, state);
    case UPDATE_NOTE_BODY:
      console.log(action);
      return updateNoteBody(action, state);

    default:
      return state;
  }
};

export default rootReducer;
