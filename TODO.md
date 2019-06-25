**_ AUTH SCREEN _**

- Sign Up should display info if user was created or an error occured (user created successfully, etc)
- Nice2Have: needs more than just a logIn/SignUp (halfPage Stylish Side with bla bla about the app maybe? )

**_ EDITOR _**

- Check the various Quill elements that should be used (link is a must, indent, custom headers...)

**_ FAB _**

- make FAB expanded when clicked
- CreateNote
- Create NoteBook
- Create Tag
- Open Favorites
- Open NoteBooks
- Open Tags

**_ APPBAR _**

- Note Info icon
- LogOut/ User info
- SaveNote Button
- SaveNote Button Animation when the note is beeing saved
- Maybe a Toast notification when the note is moved/saved/tagged/starred
- Nice2Have: create a tag on the fly, straight from the react-select in the appBar

* BUG: When the drawer is opened(notebooks/tags/etc) and then a note is expanded the appBar title doesn't update to the note name

**_ SIDENAV ITEMS _**

# Search

- Nice2have: Highlighted search result text (either in result name or the body text in case of note deep search)
- DeepSearch should also look into notes names

# Favorites:

- each item in favorites should have a clickable star/unstar icon

# Notes:

- UI should be better (more space for the notes, buttons on hover etc.)
- Delete/Star/Info should be somehow triggered from the sidenav (thrue menu or buttons)
- (soft) delete note -> needs a confirmation dialog

# Notebooks:

- Rename Notebook
- Star Notebook
- Delete Notebook (puts all notes into trash and moves them to default notebook)

# Tags:
* BUG:overflow-x with long names
- Star Tag
- Delete Tag (Should also delete all references from all notes)

# Trash:

- needs properUI or reuse a modified NoteListItem
- Restore
- Hard Delete -> needs a confirmation dialog
- Open Note in spectator Mode (locked Quill Editor)

**_ Backend _**

- Default NoteBook:
  - Upon user creation the Users's Note should be marked in User.defaultNote
  - Make it immutable (user cannot rename or delete it)

# Random

- ChangeNotebook (note goes from notebook A to notebook B) \*\*\* ASK JS13 ABOUT HOW IT CAN BE DONE BETTER
- Research populate i think you need to delete it from your code (at least in note)
- RenameNotebook/Note
- BACKEND DeleteNote should target only notes in TrashNotebook
- HardDelete
- - - Reset Password/Send Email Validation/Security Questions

**_ BUGS _**

- when a tag is added or removed from the SelectTag component it triggers a re-render, making the tag to disappear and reappear (when the response from the server hits back) which looks like a glitch
- when moving a note to a different notebook upDatedAt is modified but the sorting doesnt change in AppBar
-
- - edit a note and quickpress trash --> this will trigger two posts:
- \*1)update notebody 2)moveNotetotrash, since moveNoteToTrash is fired instantly the trashed note will not have the last edits
- \*but the note will stay in state with the edit in state.notes.
- \*A)so should I do some short of autosave before trashing the note?
- \*B)the note that is added to the state is added by the updateNoteBody so I could check there if the note.trash ===true instead of appending it to the
- \*state.notes, push it into state.trash

# UI Bugs:

- Extremely long tag (without spaces) can underflow in drawer sneaking up to the ... button, (shorten long names?)
  - Extremely long tag expands the appbars height and causes a slight scrolling vertical scroll

# Various things to think about:

- check the app by spamming component did update in every component to check for rerenders
- React Select inside a MaterialUI Dialog causes the dialog to overflow see:
- \*https://github.com/mui-org/material-ui/issues/11824
- (_modals_) Could not ditch Reac-modal since MAterialUI (Modal/Dialog) overflows

* activeNotebook is an unused property of the state, either delete it or it could be used to select the notebook by default in createNote modal (when createing a notebook or filter notes by notebook should set activenotebook,) <-- Nice2have
* -rename activeUITypes (CONSTANT)
* probably need reducers to take care of multiple things updating something
* !@! REFACTOR NOTELISTS! needs to have star/delete/info button either static or appear on hover
* The way you close previously openned modals if another one is clicked is not great... better think of smth better
* when editing note,notebooks it would be better not to push/pull but destructure & replace so the order of the items stays consistent
* It looks like there are several instances of `@material-ui/styles` initialized in this application. This may cause theme propagation issues, broken class names and makes your application bigger without a good reason.

- See https://material-ui.com/getting-started/faq#i-have-several-instances-of-styles-on-the-page for more info.

## low Priority

- Login page enable 'remember me' commented out checkbox, along with its functionality

- for TAGS SELECT could use Material-UI example with chips https://material-ui.com/components/autocomplete/
  (it still uses react-select under the hood)
- create a theme for the app global styles / create a dark theme
- (QUILL) If you want the toolbar not to be fixed but appear when you select some text use the bubble theme
- create and add sempernote logo in index.html head
- add sempernote logo in sidenav that will redirect to home (and clean up active note)
- add font roboto to the list of selected fonts in QUILL -->
  https://stackoverflow.com/questions/43728080/how-to-add-font-types-on-quill-js-with-toolbar-options
- limit the number of characters that the notebook / note can have
- Probably X^y should be removed (at least from the small screen) and replaced with link, image, indentation which are more usefull
- mobile tollbar for quill https://stackoverflow.com/questions/51706247/quill-how-to-prevent-toolbar-from-scrolling-and-set-the-height

## MEdium Priority

- MOVE State from the app to a wrapper component
- Select Tag can overflow-y very very badly.... need to find a way to target the coresponding div and set its max-height to ~60px

## High Priority

- Create Documentation
- https://github.com/material-components/material-components-web/issues/1912
- https://material-ui.com/api/typography/ -> nowrap
- godbless \_lodash https://lodash.com/docs/4.17.11#truncate
- 25 chars on 400px wide drawer seems good
- https://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript
