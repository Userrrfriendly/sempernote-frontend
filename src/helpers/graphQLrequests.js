export const fetchUserData = userId =>
  `query {
  user(userId: "${userId}") {
    username
    notebooks {
      _id
      name
      notes{
        _id
        title
        body
        createdAt
        updatedAt
        notebook{
          _id
          name
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
    notebook{
      _id
      name
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
    notebook{
      _id
      name
    }
  }
}`;

export const createNotebook = name =>
  `mutation {
  createNotebook(name:"${name}"){
    _id
    name
    notes{
      _id
    }
  }
}`;
