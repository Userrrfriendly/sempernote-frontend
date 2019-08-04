**_ AUTH SCREEN _**

- Nice2Have: needs more than just a logIn/SignUp (halfPage Stylish Side with bla bla about the app maybe? )

**_ EDITOR _**

- Check the various Quill elements that should be used (link is a must, img, indent, custom headers...)

**_ FAB _**

**_ APPBAR _**

- Note Info icon
- LogOut/ User info
- SaveNote Button
- SaveNote Button Animation when the note is beeing saved
- Nice2Have: create a tag on the fly, straight from the react-select in the appBar

**_ SIDENAV ITEMS _**

# Search

- Nice2have: Highlighted search result text (either in result name or the body text in case of note deep search)

# Favorites:

# Notes:

- Refactor <NoteListItem> to something more presentable Delete/Star/Info/Rename (consistency)
- when notelist is empty display some content to notify the user about it otherwise it looks empty
- Nice2Have: DeleteNote Dialog (and other dialogs) should have <Typography> instead of plain text
- Nice2Have: Highlight NoteListItem that is expanded
- no sorting when restoring a note

# Notebooks:

- Nice2Have:On the front show warning when the notebook exceeds max-length (max 30-40 chars)

# Tags:

# Trash:

- Nice2Have: Refactor UI in Trash

**_ Backend _**

- Default NoteBook:
  - Make it immutable (user cannot rename or delete it)
- transformTag is mistyped... tranformTag or smth

- Nice2have:
  - Password Length and Validation.... maybe this should be handled at front end?
  - Password verification with email
  - Password Reset
  - Security Question for restoring password
  - Note Versioning
  - data Encryption on the backend
  - Set Reminders
  - Text Encrytion on the front end
  - PWD features

# Random

- check the app by spamming component did update in every component to check for rerenders
- https://github.com/material-components/material-components-web/issues/1912
- https://stackoverflow.com/questions/49881826/importing-quill-to-react-app-throws-react-is-not-defined-unexpected-token-im
- React Select inside a MaterialUI Dialog causes the dialog to overflow see:
- \*https://github.com/mui-org/material-ui/issues/11824
- (_modals_) Could not ditch Reac-modal since MAterialUI (Modal/Dialog) overflows

* -rename activeUITypes (CONSTANT)
* refactor all requests so that they return only the necessary data
* -WHY DO I HAVE BODY ON CREATE NOTE?
* renameNotebook should probably be reveresed (first rename then send request) also its a waste of bandwith since it returns the whole notebook but it could return just ID and the modified notebook.name
*

**_ BUGS _**

# UI Bugs:

- Extremely long tag (without spaces) can underflow in drawer sneaking up to the ... button, (shorten long names?)
  - Extremely long tag expands the appbars height and causes a slight scrolling vertical scroll
- Select Tag can overflow-y very very badly.... need to find a way to target the coresponding div and set its max-height to ~60px
- Edit a note -> before save is complete delete it (will return two notes one in trash and one in notes);
  - All Notes: vandaloupvanda..loup overflow in notelistitem
- long note names hide the morevertical icon at the notelist

## Nice2Have:

- create a theme for the app global styles / create a dark theme
- (QUILL) If you want the toolbar not to be fixed but appear when you select some text use the bubble theme
- create and add sempernote logo in index.html head
- add sempernote logo in sidenav that will redirect to home (and clean up active note)
- add font roboto to the list of selected fonts in QUILL -->
  https://stackoverflow.com/questions/43728080/how-to-add-font-types-on-quill-js-with-toolbar-options
- mobile tollbar for quill https://stackoverflow.com/questions/51706247/quill-how-to-prevent-toolbar-from-scrolling-and-set-the-height

## High Priority

- Create Documentation

## Sprint

- /_\*\* CHECK NATIVE QUILL FOCUS _/

## TOASTS :

- \$TOAST: AuthScreen: Sign Up should display info/TOAST if user was created or an error occured (user created successfully, etc)
- \$TOAST: APPBAR: Maybe a Toast notification when the note is moved/saved/tagged/starred
- \$TOAST :Delete Default Notebook -> should trigger a Toast telling the user that the default notebook can't be deleted
- \$TOAST: When a user clicks in the (locked)editor signal a TOAST 'cannot edit a note that is in TRASH'
- \$TOAST: Rename Note in APPBAR needs toast to report errors

## Responsive UI

- MediaQuery custom hook?

* bottom shadow in main drawer on small screens (change device nexus 7/galaxy5)
* font-size and other bugs with the notelist card
* rename custom hook useScreenSize and the const where its stored in the components (scrSize) once done
