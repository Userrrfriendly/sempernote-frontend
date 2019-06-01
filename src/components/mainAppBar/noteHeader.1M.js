import React from "react";
import "./noteHeader.css";

class NoteHeader extends React.Component {
  /**
   * if activeNote || newNote -> render input
   * if activeNotebook -> render 'Notebook Name'
   * if none of the above render all notes
   * props.activeNote && props.activeNote.hasOwnProperty("_id")
   */

  render() {
    return (
      <div className="note-header">
        {this.props.activeNote ? (
          <>
            <div className="input-field">
              <input
                id="note-title"
                type="text"
                className="validate"
                defaultValue={this.props.activeNote.title}
              />
              <label htmlFor="note-title">Title:</label>
            </div>
            {/* {console.log(this.props.activeNote.notebook.name)} */}
            <select className="browser-default">
              <option value="1" disabled>
                Choose your option
              </option>
              {this.props.notebooks.map((notebook, i) => (
                <option key={notebook._id} value={i}>
                  {notebook.name}
                </option>
              ))}
            </select>
          </>
        ) : (
          <p>All notes</p>
        )}
      </div>
    );
  }
}

export default NoteHeader;
