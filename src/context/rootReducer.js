export const LOG_IN = "LOG_IN";
export const FETCH_USER_DATA = "FETCH_USER_DATA";
export const CREATE_NOTEBOOK = "CREATE_NOTEBOOK";

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

const createNotebook = (action, state) => {
  const notebooks = [...state.notebooks];
  notebooks.push(action.notebook);
  return {
    ...state,
    notebooks
  };
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
    default:
      return state;
  }
};

export default rootReducer;
