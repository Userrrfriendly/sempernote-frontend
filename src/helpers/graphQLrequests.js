export const fetchUserData = userId =>
  `query {
  user(userId: "${userId}") {
    username
    tags{
      _id
      tagname
      favorite
      notes {
        _id
        title
        trash
      }
    }
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
        tags{
          _id
          tagname
        }
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

/** NOTEBOOKS **/
export const createNotebook = name =>
  `mutation {
  createNotebook(name:"${name}"){
    _id
    name
    favorite
    notes{
      _id
      title
    }
  }
}`;

export const notebookFavoriteTrue = id =>
  `mutation {
  notebookFavoriteTrue(notebookID:"${id}"){
    _id
    name
    favorite
    notes{
      _id
      title
      trash
    }
  }
}`;

export const notebookFavoriteFalse = id =>
  `mutation {
  notebookFavoriteFalse(notebookID:"${id}"){
    _id
    name
    favorite
    notes{
      _id
      title
      trash
    }
  }
}`;

export const notebookRename = (ID, name) =>
  `mutation {
    notebookRename(notebookID:"${ID}",name:"${name}"){
      _id
      name
      favorite
      notes{
        _id
        title
        trash
      }
  }
}`;

export const notebookDelete = ID =>
  `mutation {
  notebookDelete(notebookID: "${ID}") {
    _id
    name
  }
}
`;

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
    tags{
      _id
      tagname
    }
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
    tags{
      _id
      tagname
    }
    notebook{
      _id
      name
      favorite
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
    tags {
      _id
      tagname
    }
    notebook {
      _id
      name
      favorite
      notes{
        _id
        title
        trash
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
      name
      favorite
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
      name
      favorite
    }
  }
  }`;

export const noteFavoriteTrue = noteID =>
  `mutation {
    noteFavoriteTrue(noteID:"${noteID}"){
    _id
    title
    body
    createdAt
    updatedAt
    favorite
    trash
    tags{
      _id
      tagname
    }
    notebook {
      _id
      name
      favorite
    }
  }
  }`;

export const noteFavoriteFalse = noteID =>
  `mutation {
    noteFavoriteFalse(noteID:"${noteID}"){
    _id
    title
    body
    createdAt
    updatedAt
    favorite
    trash
    tags{
      _id
      tagname
    }
    notebook{
      _id
      name
      favorite
    }
  }
  }`;

//TAGS
export const createTag = tagname =>
  `  mutation {
    createTag(tagName: "${tagname}") {
      _id
      tagname
      favorite
      notes {
        _id
        title
      }
    }
  }`;

export const assignTag = (tagID, noteID) =>
  `mutation {
    assignTag(assignTagInput: {tagID: "${tagID}", noteID: "${noteID}"}) {
      _id
      tagname
      favorite
      notes {
        _id
        title
        trash
      }
    }
  }`;

export const unAssignTag = (tagID, noteID) =>
  ` mutation { 
    unAssignTag (tagID:"${tagID}", noteID:"${noteID}") {
    _id
    tagname
    favorite
    notes{
      _id
      title
      trash
    }
  }
}`;

export const tagFavoriteTrue = tagID =>
  `mutation {
  tagFavoriteTrue(tagID:"${tagID}") {
    _id
    tagname
    favorite
    notes{
      _id
      title
      trash
    }
  }
}`;

export const tagFavoriteFalse = tagID =>
  `mutation {
  tagFavoriteFalse(tagID:"${tagID}") {
    _id
    tagname
    favorite
    notes{
      _id
      title
      trash
    }
  }
}`;

//returns the deleted Tag object
export const deleteTag = tagID =>
  `mutation {
  deleteTag(tagID:"5cfe6ce5eccbc71ccc20d003") {
    _id
    tagname
    favorite
    notes{
      _id
      title
      trash
    }
  }
}`;
