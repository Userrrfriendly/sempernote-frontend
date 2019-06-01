## Small Priority

- Login page enable 'remember me' commented out checkbox, along with its functionality
- Login page enable "forgot password" -> backend
- On the NotelistItem card you could display a custom avatar indicating the notebook (the user will choose the avatar color/icon/text) || the better solution could be to display an icon if it is a note/notebook/tag ?
- create a theme for the app / create a dark theme
- mobile tollbar for quill https://stackoverflow.com/questions/51706247/quill-how-to-prevent-toolbar-from-scrolling-and-set-the-height
- (QUILL) If you want the toolbar not to be fixed but appear when you select some text use the bubble theme
- create and add sempernote logo in index.html head
- add font roboto to the list of selected fonts in QUILL

## MEdium Priority

- CARDS ON HOVER RAISED OR BIGGER SHADOW
- CARDS action needs to expand a menu
- Kill margin on cards/editor when the sidenav is hidden
- learn context + hooks magic
- tooltips for sidenav
- MOVE State from the app to a wrapper component
- BACKEND isTrash --> favorite
- BACKEND softDeleteNote --> note moves to TrashNotebook
- BACKEND DeleteNote should target only notes in TrashNotebook
- QUILL editor's toolbar should be fixed
- add breakpoint or smth to hide the notesList when the editor is opened

## High Priority

- To hide the notelists when the editor opens you will need <route exact /main> && activenote
- in order to do it <Main/> must be refactored into a functional component with hooks
- NoteHeader should encapsulate NoteListItems or whatever it is rendering

## Sprint:

- Design the NoteHeader functionality and implement it then->
- rewrite <main/> as a functional component with hoocks
- complete the margin on the grid thingy and the media requirement to hide notes when the editor is expanded on big screens

# Tips:

\*useContext hook replaces static context = ....
