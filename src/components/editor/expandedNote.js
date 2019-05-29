import React, { Component } from "react";
import Quill from "quill";
import Delta from "quill-delta";
import "./quillSnow.css";
import { debounce, isEqual } from "lodash";

class ExpandedNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delta: new Delta(JSON.parse(this.props.note.body))
    };
  }

  editorRef = React.createRef();

  componentDidMount() {
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      ["blockquote", "code-block"],
      // [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, false] }],
      [{ font: [] }],
      [{ align: [] }],

      ["clean"] // remove formatting button
    ];

    this.editor = new Quill(this.editorRef.current, {
      modules: {
        toolbar: toolbarOptions
      },
      theme: "snow" // Specify theme in configuration
    });

    this.editor.setContents(this.state.delta);

    this.editor.on("text-change", (delta, oldDelta, source) => {
      /** This callback watches for changes in the editor and triggers setState && also saves the changes by calling autosave()
       * delta -> returns only the changes compared to previous delta, is useless on its own
       * oldDelta -> returns previous delta
       * source returns who modified the editor: either 'api' or 'user'
       * While a note is open and the user clicks on a new note source returns 'api' thus
       * autosave.flush() can be used which will force save any debounced edits on the previous note
       */
      const prevDelta = this.state.delta;
      const currentDelta = this.editor.getContents();
      const prevNoteId = this.props.note._id;
      if (source === "user") {
        this.autoSave(currentDelta, prevDelta, prevNoteId);
      } else if (source === "api") {
        this.autoSave.flush();
      }

      this.setState({
        delta: currentDelta
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.note._id !== this.props.note._id) {
      //the condition will be true if the user opens a new note
      const newBody = new Delta(JSON.parse(this.props.note.body));
      this.editor.setContents(newBody);
      this.setState({
        delta: newBody
      });
    }
    console.log("EDITOR UPDATED");
  }

  componentWillUnmount() {
    this.autoSave.flush();
    console.log("Editor unmounting...");
  }

  autoSave = debounce((currentDelta, prevDelta, noteId) => {
    if (!isEqual(currentDelta, prevDelta)) {
      // console.log("currentDelta and prevDelta are NOT equal, saving changes");
      this.props.updateNoteBody(noteId, currentDelta);
    }
  }, 3000);

  /*
  // getDelta & setDelta ARE USED ONLY IN DEBUGGING
  getDelta = () => {
    //*Get Delta from editor
    const delta = this.editor.getContents();

    window.delta = delta;
    //*Convert Delta to string
    const strFromDelta = JSON.stringify(delta);
    //to get the string from delta to insert it in mongo as default note use console.log(JSON.stringify(strFromDelta))
    window.strFromDelta = strFromDelta;
    window.dd = JSON.stringify(strFromDelta);
    // *Convert string to Delta
    const noteBody = new Delta(JSON.parse(strFromDelta));
    // console.log(noteBody);
    window.noteBody = noteBody;
  };

  setDelta = () => {
    //*Set Delta
    this.editor.setContents(window.noteBody);
  };
*/

  render() {
    return (
      <div className="editor-container">
        <div ref={this.editorRef} className="editor z-depth-3" />

        {/* THE BUTTONS ARE USED ONLY IN DEBUGGING  */}
        {/* <button className="btn" onClick={this.getDelta}>
          Get Delta
        </button>
        <button
          style={{ backgroundColor: "red" }}
          className="btn"
          onClick={this.setDelta}
        >
          SET Delta
        </button> */}
      </div>
    );
  }
}

export default ExpandedNote;

// https://stackoverflow.com/questions/49881826/importing-quill-to-react-app-throws-react-is-not-defined-unexpected-token-im
