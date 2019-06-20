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

- QUILL click inside the editor doesn't seem to focus on text (need to grow the editable area)
- QUILL editor's toolbar should be fixed

- AuthScreen Sign Up Doesn't redirect to Log In
- CARDS action needs to expand a menu (delete, info, and maybe metatada)
- MOVE State from the app to a wrapper component
- Select Tag can overflow-y very very badly.... need to find a way to target the coresponding div and set its max-height to ~60px
- (soft) delete note probably needs a confirmation

- Floating action button needs to be populated

## High Priority

- Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.:
- To reproduce (slow 3G) 1.open note, 2.star it 3.open another note

## Sprint:

- the render UI could be depricated, establish if it is needed
- at login add password visible/invisible icon
- noteInfo in appBar will have to wait till sidenav is done the same goes for save
- make trash and default notebook undeletable
- when moving a note to a different notebook upDatedAt is modified but the sorting doesnt change in AppBar

### Backend

- ChangeNotebook (note goes from notebook A to notebook B) \*\*\* ASK STOIK ABOUT HOW IT CAN BE DONE BETTER
- Research populate i think you need to delete it from your code (at least in note)
- RenameNotebook/Note
- BACKEND DeleteNote should target only notes in TrashNotebook

* Favorites on Notebooks & TAGS
* delteNote (hard Delete needs to be modified accordingly)

# Tags:

- Add to favorites

# BUGS

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
**_STARRING NOTES SEEMS TO KILL TAGS _**

- 1)add tag 2)star 3)remove tag -> || 1)open note with a tag, 2)star 3) remove tag -> tag is killed forever
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

* when a tag is added or removed from the SelectTag component it triggers a re-render, making the tag to disappear and reappear (when the response from the server hits back) which looks like a glitch
* when starring/unstarring a note the active tags dissapear for no reason!!!
* when a note is expanded if you click on another note the notebook select is not updated
* when editing note,notebooks it would be better not to push/pull but destructure & replace so the order of the items stays consistent

# Various things to think about:

- React Select inside a MaterialUI Dialog causes the dialog to overflow see:
- \*https://github.com/mui-org/material-ui/issues/11824
- (_modals_) Could not ditch Reac-modal since MAterialUI (Modal/Dialog) overflows
- maybe add an noteIcon to noteListItems, a noteBook item to a notebook
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
- clicking on Notes on sidenav probably should just clear activeNotebook, filteredNotes
- -rename activeUI
- activeUI should be deleted?
- could menu in each notebook be replace with a single menu?
- tags probably include notes in trash
- FIX THE DOUBLE DRAWERS!!!
- probably need reducers to take care of multiple things updating something
- !@! REFACTOR NOTELISTS! needs to have star icon
