export const fetchUserData = userId =>
  `query {
  user(userId: "${userId}") {
    username
    notebooks {
      _id
      name
      favorite
      notes{
        _id
        title
        body
        favorite
        trash
        createdAt
        updatedAt
        notebook{
          _id
          name
          favorite
        }
      }
    }
  }
}`;

export const signUp = (username, email, password) =>
  `mutation {
  createUser(userInput: {username:"${username}",email: "${email}", password: "${password}"}) {
    _id
    email
    username
  }
}`;

export const logIn = (email, password) =>
  `query {
  login(email: "${email}", password: "${password}") {
    userId
    token
    tokenExpiration
  }
}`;

/** SUPER IMPORTANT: DO NOT WRAP the BODY with DOUBLE QUOTES "" */
export const createNote = (title, body, notebook) =>
  `mutation {
  createNote(noteInput: {title: "${title}", body: ${body}, notebook: "${notebook}"}) {
    _id
    title
    body
    createdAt
    updatedAt
    favorite
    trash
    notebook{
      _id
      name
      favorite
    }
  }
}`;

export const updateNoteBody = (ID, body) =>
  `mutation {
    updateNoteBody(noteID:"${ID}", body:${body}) {
    _id
    title
    body
    createdAt
    updatedAt
    favorite
    trash
    notebook{
      _id
      name
      favorite
    }
  }
}`;

export const createNotebook = name =>
  `mutation {
  createNotebook(name:"${name}"){
    _id
    name
    favorite
    notes{
      _id
    }
  }
}`;

export const renameNote = (ID, title) =>
  `mutation {
    renameNote(noteID:"${ID}",title:"${title}"){
    _id
    title
    body
    createdAt
    updatedAt
    favorite
    trash
    notebook{
      _id
      name
      favorite
    }
  }
}`;

export const moveNote = (noteID, notebookID) =>
  `mutation {
  moveNote(noteID:"${noteID}", notebookID:"${notebookID}"){
    _id
    title
    body
    createdAt
    updatedAt
    favorite
    trash
    notebook {
      _id
      name
      favorite
      notes{
        _id
        title
      }
    }
  }
  }`;

//softDelete
export const trashNote = noteID =>
  `mutation {
  softDeleteNote(noteID:"${noteID}"){
    title
    _id
    trash
    body
    createdAt
    updatedAt
    favorite
    trash
    notebook{
      _id
    }
  }
  }`;

export const restoreNote = noteID =>
  `mutation {
    restoreNote(noteID:"${noteID}"){
    _id
    title
    trash
    body
    createdAt
    updatedAt
    favorite
    trash
    notebook{
      _id
    }
  }
  }`;

export const noteFavoriteTrue = noteID =>
  `mutation {
    noteFavoriteTrue(noteID:"${noteID}"){
    _id
    title
    trash
    body
    createdAt
    updatedAt
    favorite
    trash
  }
  }`;

export const noteFavoriteFalse = noteID =>
  `mutation {
    noteFavoriteFalse(noteID:"${noteID}"){
    _id
    title
    trash
    body
    createdAt
    updatedAt
    favorite
    trash
  }
  }`;
