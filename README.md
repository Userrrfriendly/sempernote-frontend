# Sempernote

A Simple Note Taking App build with [React.js](https://reactjs.org) + useContext + useReducer for state management, [Material UI](https://material-ui.com), [Quill.js](https://quilljs.com) and [Node.js](https://nodejs.org), [Express.js](https://expressjs.com), [MongoDb](https://www.mongodb.com), [GraphQl](https://graphql.org) for the backend.
_The backend of the App is decoupled and can be found in this repository:👉 [Sempernote-Backend](https://github.com/Userrrfriendly/Sempernote-Backend)_.

---

## Functionality

The app is a simplistic clone of evernote so once registered the user can create notes in a rich text editor. Notes are stored in notebooks(each notebook can have multiple notes). Also the user has the ability to create Tags and attatch any number of Tags to each Note. Notes, Tags and notebooks can be added to favorites for quick access.

## Live version of Sempernote: [https://sempernote.herokuapp.com/](https://sempernote.herokuapp.com/)

## Running And Installing Locally

- clone or download this repository
- navigate to the root faulder and run `npm install`
- run `npm run` to kick off the front end of the app.
  - _Optionally_ in case you want to use a different mongoDb database:
    - navigate to /src/requests/ and open requests.js with your editor
    - in requests.js change the variable url to reflect your backend eg: `const url = "http://localhost:8000/graphql";`

If you want to play with the backend off the app you can find it here 👉 [Sempernote-Backend](https://github.com/Userrrfriendly/Sempernote-Backend)

## User Stories

- :heavy_check_mark: The User can create a Sempernote account by registering with an email and a password
- :heavy_check_mark: The User can login to Sempernote with his email/password
- :heavy_check_mark: All Data is persistant and is stored online in a MongoDb database.
- :heavy_check_mark: Once Logged in the User can create and edit Notes, Notebooks and Tags
- :heavy_check_mark: Each Note,Notebook and Tag can be Renamed/Deleted/Added to Favorites or Removed from Favorites
- :heavy_check_mark: Deleted Notes are moved to Trash where they can be Inspected, Restored or Permanently Deleted
- :heavy_check_mark: Tags and Notebooks are deleted permanently
- :heavy_check_mark: Each Note must belong to a single Notebook
- :heavy_check_mark: Each Note can be moved from one Notebook to another
- :heavy_check_mark: Tags can be attached to Notes
- :heavy_check_mark: The user can sort the notes by Title, Created Date, Modified Date
- :heavy_check_mark: When in note editing mode the content of the note is auto-saved (and uploaded to the database) each 2000 seconds after the user stops typing or presses the back or the save button
