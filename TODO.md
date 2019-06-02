## Small Priority

- Login page enable 'remember me' commented out checkbox, along with its functionality
- Login page enable "forgot password" -> backend
- create a theme for the app / create a dark theme
- (QUILL) If you want the toolbar not to be fixed but appear when you select some text use the bubble theme
- create and add sempernote logo in index.html head
- add sempernote logo in sidenav that will redirect to home (and clean up active note)
- add font roboto to the list of selected fonts in QUILL

## MEdium Priority

- QUILL click inside the editor doesn't seem to focus on text
- mobile tollbar for quill https://stackoverflow.com/questions/51706247/quill-how-to-prevent-toolbar-from-scrolling-and-set-the-height
- CARDS ON HOVER RAISED OR BIGGER SHADOW
- CARDS action needs to expand a menu
- Kill margin on cards/editor when the sidenav is hidden
- learn context + hooks magic
- MOVE State from the app to a wrapper component
- BACKEND isTrash --> favorite
- BACKEND softDeleteNote --> note moves to TrashNotebook
- BACKEND DeleteNote should target only notes in TrashNotebook
- QUILL editor's toolbar should be fixed
- add breakpoint or smth to hide the notesList when the editor is opened
- AuthScreen Sign Up Doesn't redirect to Log In
- MainAppBar NOTES --> Tags & Notebooks need different UI
- MainAppBar NOTES --> Sort Needs to move from /main/editor to /main/
- (*modals*) If you create a notebook and open then try to create a note it will not show in the drop down 
  (*modals*) cause the options are populated on componentDidMount first thing that comes to my mind is to re-write it with hooks
- (*modals*) Also the UI is broken cause it's based on  materializeCSS 
- (*modals*) Consider ditching Reac-modal since MAterialUI provides nice alternatives out of the box (Modal/Dialog)
- -andi gia <Hide> sto sidenav kantw me media querry kai style pou to kanei translate eksw apo thn othonh
- 

## High Priority

- To hide the notelists when the editor opens you will need <route exact /main> && activenote
- in order to do it <Main/> must be refactored into a functional component with hooks
- NoteHeader should encapsulate NoteListItems or whatever it is rendering
- kill the GRID and replace it with CSS grid (mou exei gamhsei thn zwh)

## Sprint:

- DONE - kill the GRID and replace it with CSS grid (mou exei gamhsei thn zwh) or just plain flexbox
- DONE - implement create note/notebook from sidenav
- Design the NoteHeader functionality and implement it then->
- focus ONLY on desktop

# Tips:

- useContext hook replaces static context = ....
