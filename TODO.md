## Small Priority

- Login page enable 'remember me' commented out checkbox, along with its functionality
- Login page enable "forgot password" -> backend
- create a theme for the app / create a dark theme
- (QUILL) If you want the toolbar not to be fixed but appear when you select some text use the bubble theme
- create and add sempernote logo in index.html head
- add sempernote logo in sidenav that will redirect to home (and clean up active note)
- add font roboto to the list of selected fonts in QUILL -->
- https://stackoverflow.com/questions/43728080/how-to-add-font-types-on-quill-js-with-toolbar-options
- limit the number of characters that the notebook / note can have
- CARDS ON HOVER RAISED OR BIGGER SHADOW
- Probably X^y should be removed (at least from the small screen) and replaced with link wich is more usefull
- * When notes are sorted and the user modifies a note and presses the <- button the notes are re-sorted with modified first
- * this is triggered by updateNoteBody() in the App.js file, either I should keep sorting persistant or leave it for 
- * convinience since with that behaviour the lastly modified note will always display first
- * also there probably? should be an option to sort notes when the editor is expanded
## MEdium Priority

- DO I NEED TO KEEP NOTEBOOKS UP TO DATE (AFTER A RESPONSE FROM SERVER?)?????!??!?!!?
- QUILL click inside the editor doesn't seem to focus on text
- mobile tollbar for quill https://stackoverflow.com/questions/51706247/quill-how-to-prevent-toolbar-from-scrolling-and-set-the-height
- CARDS action needs to expand a menu
- MOVE State from the app to a wrapper component
- BACKEND DeleteNote should target only notes in TrashNotebook
- QUILL editor's toolbar should be fixed
- AuthScreen Sign Up Doesn't redirect to Log In
- MainAppBar NOTES --> Tags & Notebooks need different UI
- MainAppBar NOTES --> Sort Needs to move from /main/editor to /main/
- (_modals_) If you create a notebook and open then try to create a note it will not show in the drop down
  (_modals_) cause the options are populated on componentDidMount first thing that comes to my mind is to re-write it with hooks
- (_modals_) Also the UI is broken cause it's based on materializeCSS
- (_modals_) Consider ditching Reac-modal since MAterialUI provides nice alternatives out of the box (Modal/Dialog)
- -andi gia <Hide> sto sidenav kantw me media querry kai style pou to kanei translate eksw apo thn othonh
-

## High Priority

- To hide the notelists when the editor opens you will need <route exact /main> && activenote

## Sprint:

- Design the NoteHeader functionality and implement it then
- focus ONLY on desktop

### Backend

- ChangeNotebook (note goes from notebook A to notebook B) \*\*\* ASK STOIK ABOUT HOW IT CAN BE DONE BETTER
- Research populate i think you need to delete it from your code (at least in note)
- RenameNotebook
- TAGS
- Favorites on Notebooks & TAGS
- AT DELETENOTEBOOK ->
  - 1 all notes in the notebook trash=true
  - 2 all notes inside it must be moved to default notebook
- delteNote (hard Delete needs to be modified accordingly)

# Tips:

- useContext hook replaces static context = ....
