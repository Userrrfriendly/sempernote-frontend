import {
  sortByDateNewestFirst,
  selectNotebook,
  sortByDateOldestFirst,
  sortByTitleAsc,
  sortByTitleDes
} from "../helpers/helpers";

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
export const CREATE_NOTE = "CREATE_NOTE";
export const SYNC_NEW_NOTE = "SYNC_NEW_NOTE";
export const SET_NOTE_FILTER = "SET_NOTE_FILTER";
export const SORT_NOTES = "SORT_NOTES";
export const MOVE_NOTE_TO_NOTEBOOK = "MOVE_NOTE_TO_NOTEBOOK";
export const ASSIGN_TAG = "ASSIGN_TAG";
export const UNASSIGN_TAG = "UNASSIGN_TAG";
export const NOTE_REMOVE_FAVORITE = "NOTE_REMOVE_FAVORITE";
export const NOTE_ADD_FAVORITE = "NOTE_ADD_FAVORITE";
export const TRASH_NOTE = "TRASH_NOTE";

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

const createNote = (action, state) => {
  let newNotes = state.notes;
  newNotes.push(action.note);
  sortByDateNewestFirst(newNotes, "updatedAt");
  return { ...state, notes: newNotes };
};

const syncNewNote = (action, state) => {
  //runs after CREATE_NOTE to sync the temp _id of the new note in state with the the _id from server response
  const newNotebooks = state.notebooks.filter(
    notebook => notebook._id !== action.note.notebook._id
  );
  let updatedNotebook = selectNotebook(
    state.notebooks,
    action.note.notebook._id
  );
  updatedNotebook[0].notes.push({
    _id: action.note._id,
    title: action.note.title
  });
  newNotebooks.push(updatedNotebook[0]);
  let updatedNotes = state.notes.filter(note => !note.hasOwnProperty("temp"));
  updatedNotes.push(action.note);
  sortByDateNewestFirst(updatedNotes, "updatedAt");

  return {
    ...state,
    notebooks: newNotebooks,
    notes: updatedNotes,
    activeNote: action.note
  };
};

const setNoteFilter = (action, state) => {
  //affects appbar
  return {
    ...state,
    noteFilter: { name: action.name, options: action.options }
  };
};

const sortNotes = (action, state) => {
  // props.updateNotes(sortByTitleDes(shortedNotes));
  let sortedNotes;
  // sortByDateNewestFirst(shortedNotes, "updatedAt")
  switch (action.method) {
    case "sortByDateNewestFirst":
      sortedNotes = sortByDateNewestFirst(state.notes, action.sortField);
      // sortedNotes = sortByTitleDes(state.notes);
      return { ...state, notes: sortedNotes };
    case "sortByDateOldestFirst":
      sortedNotes = sortByDateOldestFirst(state.notes, action.sortField);
      // sortedNotes = sortByTitleDes(state.notes);
      return { ...state, notes: sortedNotes };
    case "sortByTitleDes":
      sortedNotes = sortByTitleDes(state.notes);
      return { ...state, notes: sortedNotes };
    case "sortByTitleAsc":
      sortedNotes = sortByTitleAsc(state.notes);
      return { ...state, notes: sortedNotes };
    default:
      return { ...state };
  }
};

const moveNotetoNotebook = (action, state) => {
  const newNotebooks = state.notebooks.filter(
    notebook =>
      notebook._id !== action.previousNotebookID &&
      notebook._id !== action.newNotebookID
  );

  const updatedNote = state.notes.filter(note => note._id === action.noteID)[0];
  updatedNote.notebook._id = action.newNotebookID;

  const updatedNotes = state.notes.map(note =>
    note._id === action.noteID ? updatedNote : note
  );
  // //add the note to the newnotebook
  let updatedNotebook = selectNotebook(state.notebooks, action.newNotebookID);
  updatedNotebook[0].notes.push(updatedNote);
  // //delete the note from the oldnotebook
  let oldNotebook = selectNotebook(state.notebooks, action.previousNotebookID);
  oldNotebook[0].notes = oldNotebook[0].notes.filter(
    note => note._id !== action.noteID
  );
  // merge the updated previous & newNotebooks with all the notebooks
  newNotebooks.push(updatedNotebook[0], oldNotebook[0]);
  const activeNote =
    state.activeNote._id === action.noteID ? updatedNote : state.activeNote;

  return { ...state, activeNote, notes: updatedNotes, notebooks: newNotebooks };
};

const noteRemoveFavorite = (action, state) => {
  const updatedNotes = state.notes.map(note =>
    note._id === action.note._id ? { ...note, favorite: false } : note
  );

  const activeNote =
    state.activeNote && state.activeNote._id === action.note._id
      ? { ...state.activeNote, favorite: false }
      : state.activeNote;

  return { ...state, activeNote, notes: updatedNotes };
};

const noteAddFavorite = (action, state) => {
  const updatedNotes = state.notes.map(note =>
    note._id === action.note._id ? { ...note, favorite: true } : note
  );

  const activeNote =
    state.activeNote && state.activeNote._id === action.note._id
      ? { ...state.activeNote, favorite: true }
      : state.activeNote;
  return { ...state, activeNote, notes: updatedNotes };
};

const trashNote = (action, state) => {
  // .then(data => {
  const tags = state.tags.map(tag => {
    return {
      ...tag,
      notes: tag.notes.map(note =>
        note._id === action.note._id
          ? {
              _id: action.note._id,
              title: action.note.title,
              trash: action.note.trash
            }
          : note
      )
    };
  });
  const activeNote =
    state.activeNote && state.activeNote._id === action.note._id
      ? null
      : state.activeNote;
  const notes = state.notes.filter(note => note._id !== action.note._id);
  const trash = state.trash.concat({ ...action.note, trash: true });
  return { ...state, tags, activeNote, notes, trash };

  //   console.log(tags);
  //   this.setState(prevState => {
  //     return {
  //       activeNote:
  //         prevState.activeNote &&
  //         prevState.activeNote._id === data.responseNote._id
  //           ? null
  //           : prevState.activeNote,
  //       notes: prevState.notes.filter(
  //         note => note._id !== data.responseNote._id
  //       ),
  //       trash: prevState.trash.concat(data.responseNote),
  //       tags: tags
  //       // ,notebooks: data.newNotebooks
  //     };
  //   });
  // });
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

const assignTag = (action, state) => {
  const modifiedNote = state.notes.filter(
    note => note._id === action.noteID
  )[0];
  const modifiedTag = state.tags.filter(tag => tag._id === action.tagID)[0];

  modifiedNote.tags = modifiedNote.tags.concat({
    _id: modifiedTag._id,
    tagname: modifiedTag.tagname
  });
  modifiedTag.notes.push(modifiedNote);
  const updatedNotes = state.notes.map(note =>
    note._id === action.noteID ? modifiedNote : note
  );
  const updatedTags = state.tags.map(tag =>
    tag._id === action.tagID ? modifiedTag : tag
  );

  return { ...state, tags: updatedTags, notes: updatedNotes };
};

const unAssignTag = (action, state) => {
  const updatedTag = state.tags.filter(tag => tag._id === action.tagID)[0];
  const updatedNote = state.notes.filter(note => note._id === action.noteID)[0];
  updatedTag.notes = updatedTag.notes.filter(
    note => note._id !== action.noteID
  );
  updatedNote.tags = updatedNote.tags.filter(tag => tag._id !== action.tagID);
  const updatedTags = state.tags.map(tag =>
    tag._id === action.tagID ? updatedTag : tag
  );
  const updatedNotes = state.notes.map(note =>
    note._id === action.noteID ? updatedNote : note
  );

  return { ...state, tags: updatedTags, notes: updatedNotes };
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
    case CREATE_NOTE:
      console.log(action);
      return createNote(action, state);
    case SYNC_NEW_NOTE:
      //runs after CREATE_NOTE to sync the temp _id of the new note in state with the the _id from server response
      console.log(action);
      return syncNewNote(action, state);
    case SET_NOTE_FILTER:
      console.log(action);
      return setNoteFilter(action, state);
    case SORT_NOTES:
      console.log(action);
      return sortNotes(action, state);
    case MOVE_NOTE_TO_NOTEBOOK:
      console.log(action);
      return moveNotetoNotebook(action, state);
    case ASSIGN_TAG:
      console.log(action);
      return assignTag(action, state);
    case UNASSIGN_TAG:
      console.log(action);
      return unAssignTag(action, state);
    case NOTE_REMOVE_FAVORITE:
      console.log(action);
      return noteRemoveFavorite(action, state);
    case NOTE_ADD_FAVORITE:
      console.log(action);
      return noteAddFavorite(action, state);
    case TRASH_NOTE:
      console.log(action);
      return trashNote(action, state);
    default:
      return state;
  }
};

export default rootReducer;
