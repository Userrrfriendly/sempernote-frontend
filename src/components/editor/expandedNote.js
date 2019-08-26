import React, { Component } from "react";
import Quill from "quill";
import Delta from "quill-delta";
import "./quillSnow.css";
import { debounce, isEqual } from "lodash";

// const style = {
//   width: "100%",
//   boxSizing: "inherit",
//   color: "red"
// };

class ExpandedNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delta: new Delta(JSON.parse(this.props.note.body))
    };
  }

  editorRef = React.createRef();
  containerRef = React.createRef();

  componentDidMount() {
    this._ismounted = true;
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

    const toolbar = this.containerRef.current.querySelector(".ql-toolbar"); //quill toolbar
    if (this.props.note.trash) {
      //disable editing if the note is marked as trash
      this.editor.disable();
      toolbar.classList.add("ql-toolbar-disabled");
    } else {
      this.editor.enable();
      toolbar.classList.remove("ql-toolbar-disabled");
    }

    //Prevent Scrolling to Top when a .ql-picker(font-size picker, color-picker,etc ) is clicked
    // https://github.com/quilljs/quill/issues/1690
    const qlPickers = this.containerRef.current.querySelectorAll(".ql-picker");
    qlPickers.forEach(picker =>
      picker.addEventListener("mousedown", e => e.preventDefault())
    );

    /*** CHECK NATIVE QUILL FOCUS  */
    //focus the text area in the editor once it opens
    this.editorRef.current.querySelector(".ql-editor").focus();
  }

  componentDidUpdate(prevProps, prevState) {
    // if the save button was pressed -> trigger autoSave.flush()
    if (this.props.manualSave) {
      this.autoSave.flush();
      this.props.manualSaveDisable();
    }
    //triggers if the user opens a new note
    if (
      prevProps.note._id !== this.props.note._id ||
      prevProps.note.trash !== this.props.note.trash
    ) {
      //double check if the component is mounted
      if (this._ismounted) {
        const newBody = new Delta(JSON.parse(this.props.note.body));
        this.editor.setContents(newBody);
        this.setState({
          delta: newBody
        });

        //disable editing if the note is marked as trash
        const toolbar = this.containerRef.current.querySelector(".ql-toolbar"); //quill toolbar
        if (this.props.note.trash) {
          this.editor.disable();
          toolbar.classList.add("ql-toolbar-disabled");
        } else {
          this.editor.enable();
          toolbar.classList.remove("ql-toolbar-disabled");
        }
      }
    }

    console.log("EDITOR UPDATED");
  }

  componentWillUnmount() {
    this.autoSave.flush();
    this._ismounted = false;
    console.log("Editor unmounting...");
  }

  autoSave = debounce((currentDelta, prevDelta, noteId) => {
    if (!isEqual(currentDelta, prevDelta)) {
      this.props.updateNoteBody(noteId, currentDelta);
    }
  }, 2000);

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
      <>
        {/* <div className="editor_bar" style={style}>
          {" "}
          appbar
        </div> */}
        <div ref={this.containerRef} className="editor-container">
          <div
            ref={this.editorRef}
            className="editor z-depth-3"
            onClick={this.props.note.trash ? this.props.toast : () => {}}
          />

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
      </>
    );
  }
}

export default ExpandedNote;
