**_ AUTH SCREEN _**

- \$TOAST Sign Up should display info/TOAST if user was created or an error occured (user created successfully, etc)
- Nice2Have: needs more than just a logIn/SignUp (halfPage Stylish Side with bla bla about the app maybe? )

**_ EDITOR _**

- Check the various Quill elements that should be used (link is a must, img, indent, custom headers...)

**_ FAB _**

**_ APPBAR _**

- Note Info icon
- LogOut/ User info
- SaveNote Button
- SaveNote Button Animation when the note is beeing saved
- \$TOAST: Maybe a Toast notification when the note is moved/saved/tagged/starred
- Nice2Have: create a tag on the fly, straight from the react-select in the appBar

**_ SIDENAV ITEMS _**

# Search

- Nice2have: Highlighted search result text (either in result name or the body text in case of note deep search)

# Favorites:

# Notes:

- UI should be better (more space for the notes, buttons on hover etc.)
- Delete/Star/Info/Rename should be somehow triggered from the <NoteList> ( menu or buttons)
- when notelist is empty display some content to notify the user about it otherwise it looks empty
- Nice2Have: DeleteNote Dialog (and other dialogs) should have <Typography> instead of plain text

# Notebooks:

- Nice2Have:Delete Default Notebook -> should trigger a Toast telling the user that the default notebook can't be deleted
- Nice2Have:On the front show warning when the notebook exceeds max-length (max 30-40 chars)

# Tags:

# Trash:

- needs properUI or reuse a modified NoteListItem
- Nice2Have: When a user clicks in the (locked)editor signal a TOAST 'cannot edit a note that is in TRASH'

**_ Backend _**

- Default NoteBook:
  - Upon user creation the Users's Note should be marked in User.defaultNote
  - Make it immutable (user cannot rename or delete it)
- Auth. token -> password should move to nodemon.json
- transformTag is mistyped... tranformTag or smth
- Hard DeletNote && DeleteNotebook
- Password Length and Validation.... maybe this should be handled at front end?

- Nice2have:
  - Password verification with email
  - Password Reset
  - Security Question for restoring password
  - Note Versioning
  - data Encryption on the backend
  - Set Reminders
  - Text Encrytion on the front end
  - PWD features

# Random

- FetchUserData doesn't need authentication?!?! srsly!?
- implement defaultNotebook on the front end
- BACKEND DeleteNote should target only notes in TrashNotebook
- HardDelete
- - - Reset Password/Send Email Validation/Security Questions

**_ BUGS _**

# UI Bugs:

- Extremely long tag (without spaces) can underflow in drawer sneaking up to the ... button, (shorten long names?)
  - Extremely long tag expands the appbars height and causes a slight scrolling vertical scroll

# Various things to think about:

- Highlight NoteList that is expanded
- check the app by spamming component did update in every component to check for rerenders
- React Select inside a MaterialUI Dialog causes the dialog to overflow see:
- \*https://github.com/mui-org/material-ui/issues/11824
- (_modals_) Could not ditch Reac-modal since MAterialUI (Modal/Dialog) overflows

* -rename activeUITypes (CONSTANT)

## Nice2Have:

- Login page enable 'remember me' commented out checkbox, along with its functionality
- for TAGS SELECT could use Material-UI example with chips https://material-ui.com/components/autocomplete/
  (it still uses react-select under the hood)
- create a theme for the app global styles / create a dark theme
- (QUILL) If you want the toolbar not to be fixed but appear when you select some text use the bubble theme
- create and add sempernote logo in index.html head
- add sempernote logo in sidenav that will redirect to home (and clean up active note)
- add font roboto to the list of selected fonts in QUILL -->
  https://stackoverflow.com/questions/43728080/how-to-add-font-types-on-quill-js-with-toolbar-options
- link, image, indentation in QUILL
- mobile tollbar for quill https://stackoverflow.com/questions/51706247/quill-how-to-prevent-toolbar-from-scrolling-and-set-the-height

## MEdium Priority

- Select Tag can overflow-y very very badly.... need to find a way to target the coresponding div and set its max-height to ~60px

## High Priority

- Create Documentation
- https://github.com/material-components/material-components-web/issues/1912

## Sprint

- Editor toolbar with deletenote dialog bug
- All Notes: decide about what icons to display and what to display in the menu
  - vandaloupvanda..loup overflow in notelistitem

* -WHY DO I HAVE BODY ON CREATE NOTE?
* renameNotebook should probably be reveresed (first rename then send request) also its a waste of bandwith since it returns the whole notebook but it could return just ID and the modified notebook.name

- UPDATE LODASH IN PACKAGE.JSON also on backend too
- long note names hide the morevertical icon at the notelist
- rename note has the same problem with rename tag-> when a note is renamed notebooks....note.title is note updated (appState)
- create 2notes add them to a TAG, delete one note, in the tags drawer it will show as having two notes (does not filter trash) -> check it with deleteNote && delete NoteBook
- /_\*\* CHECK NATIVE QUILL FOCUS _/
- Rename Note in APPBAR needs toast to report errors
- https://stackoverflow.com/questions/49881826/importing-quill-to-react-app-throws-react-is-not-defined-unexpected-token-im

## Responsive UI

- Could I save the screen size in the state and then render things based on screen size?
- Dialogs are too big
