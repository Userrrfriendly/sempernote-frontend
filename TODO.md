
*** AUTH SCREEN ***
- probably needs more than just a logIn/SignUp (halfPage Stylish Side with bla bla maybe? )
- Sign Up should switch to login 
- Sign Up should display info if user was created or an error occured (user created successfully, etc)
- Show/Hide Password icon could be added

*** EDITOR ***
- Click (to Edit) Area should be full height
- Toolbar should be fixed
- Check the various Quill elements that should be used (link is a must, indent, custom headers...)

*** FAB ***
- CreateNote
- Create NoteBook
- Create Tag
- Open Favorites
- Open NoteBooks
- Open Tags

*** APPBAR ***
- Note Info
- LogOut/ User info
- SaveNote Button
- SaveNote Button Animation when the note is beeing saved
- Maybe a Toast notification when the note is moved/saved/tagged/starred
- It would be nice to be able to create a tag on the fly, straight from the react-select in the appBar
* BUG: When the drawer is opened(notebooks/tags/etc) and then a note is expanded the appBar title doesn't update to the note name

*** SIDENAV ITEMS ***
# Search
- Should have modal
- Search (live in note.name)
- by clicking enter it should search in note.bodies for the search querry
- should have access to quill delta (in order to be able to search in note.body)

# Favorites:
- Should have a modal
- Search
- Display Notes/Notebooks/Tags with different icon
- each item in favorites should have a clickable star/unstar icon 
- Upon clicking the favorite item it should display either:
  - note -> open the note and on the side display all notes
  - notebook -> same as clicking on a notebook in notebook drawer
  - tag -> same as clicking on a tag in tag drawer

# Notes:
- UI should be better (more space for the notes, buttons on hover etc.)
- Delete/Star/Info should be somehow triggered from the sidenav (thrue menu or buttons)
- (soft) delete note -> needs a confirmation dialog

# Notebooks:
- Rename Notebook
- Star Notebook
- Delete Notebook (puts all notes into trash and moves them to default notebook)

# Tags:
- Star Tag
- Delete Tag (Should also delete all references from all notes)

# Trash: 
- needs properUI or reuse a modified NoteListItem
- Restore
- Hard Delete -> needs a confirmation dialog
- Open Note in spectator Mode (locked Quill Editor)

*** Backend *** 
- Default NoteBook:
  - Upon user creation the Users's Note should be marked in User.defaultNote
  - Make it immutable (user cannot rename or delete it)
# Random
- ChangeNotebook (note goes from notebook A to notebook B) \*\*\* ASK STOIK ABOUT HOW IT CAN BE DONE BETTER
- Research populate i think you need to delete it from your code (at least in note)
- RenameNotebook/Note
- BACKEND DeleteNote should target only notes in TrashNotebook
- HardDelete 

*** BUGS ***
- when a tag is added or removed from the SelectTag component it triggers a re-render, making the tag to disappear and reappear (when the response from the server hits back) which looks like a glitch
- when a note is expanded if you click on another note the notebook select is not updated

# UI Bugs:
- Extremely long tag (without spaces) can underflow in drawer sneaking up to the ... button, 
  - Extremely long tag  expands the appbars height and causes a slight scrolling vertical scroll


# Various things to think about:
- the render UI could be depricated, establish if it is needed
- when moving a note to a different notebook upDatedAt is modified but the sorting doesnt change in AppBar
- React Select inside a MaterialUI Dialog causes the dialog to overflow see:
- \*https://github.com/mui-org/material-ui/issues/11824
- (_modals_) Could not ditch Reac-modal since MAterialUI (Modal/Dialog) overflows
- check the app by spamming component did update in every component to check for rerenders
- - edit a note and quickpress trash --> this will trigger two posts:
- \*1)update notebody 2)moveNotetotrash, since moveNoteToTrash is fired instantly the trashed note will not have the last edits
- \*but the note will stay in state with the edit in state.notes.
- \*A)so should I do some short of autosave before trashing the note?
- \*B)the note that is added to the state is added by the updateNoteBody so I could check there if the note.trash ===true instead of appending it to the
- \*state.notes, push it into state.trash
- when createing a notebook or filter notes by notebook should set activenotebook,
- also maybe remove setActiveNotebook on noteClick (noteListItem)
- also activeNotebook should be used to select the notebook by default in createNote modal
- -rename activeUITypes (CONSTANT)
- activeUI should be deleted?
- probably need reducers to take care of multiple things updating something
- !@! REFACTOR NOTELISTS! needs to have star/delete/info button either static or appear on hover
- The way you close previously openned modals if another one is clicked is not great... better think of smth better 
- when editing note,notebooks it would be better not to push/pull but destructure & replace so the order of the items stays consistent

## low Priority
- Login page enable 'remember me' commented out checkbox, along with its functionality
- Login page enable "forgot password" -> backend
- https://material-ui.com/components/text-fields/ Input Adornments show/hide password
- for TAGS SELECT could use Material-UI example with chips https://material-ui.com/components/autocomplete/
  (it still uses react-select under the hood)
- create a theme for the app global styles / create a dark theme
- (QUILL) If you want the toolbar not to be fixed but appear when you select some text use the bubble theme
- create and add sempernote logo in index.html head
- add sempernote logo in sidenav that will redirect to home (and clean up active note)
- add font roboto to the list of selected fonts in QUILL -->
  https://stackoverflow.com/questions/43728080/how-to-add-font-types-on-quill-js-with-toolbar-options
- limit the number of characters that the notebook / note can have
- CARDS ON HOVER RAISED OR BIGGER SHADOW
- Probably X^y should be removed (at least from the small screen) and replaced with link wich is more usefull
- mobile tollbar for quill https://stackoverflow.com/questions/51706247/quill-how-to-prevent-toolbar-from-scrolling-and-set-the-height


## MEdium Priority
- MOVE State from the app to a wrapper component
- Select Tag can overflow-y very very badly.... need to find a way to target the coresponding div and set its max-height to ~60px
- Create Documentation
## High Priority
