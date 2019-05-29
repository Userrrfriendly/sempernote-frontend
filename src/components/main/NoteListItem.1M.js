import React from "react";
import moment from "moment";
import Delta from "quill-delta";

const NoteListItem = props => {
  const previewText = str => {
    //toPlaintext() is from https://github.com/purposeindustries/quill-delta-to-plaintext
    function toPlaintext(delta) {
      return delta.reduce(function(text, op) {
        if (!op.insert)
          throw new TypeError("only `insert` operations can be transformed!");
        if (typeof op.insert !== "string") return text + " ";
        return text + op.insert;
      }, "");
    }

    const parsedDelta = new Delta(JSON.parse(str));
    const plainText = toPlaintext(parsedDelta);

    if (plainText.length > 400) {
      const sliceIndex = plainText.lastIndexOf(" ", 400);
      return str.slice(0, sliceIndex).concat("...");
    }
    return plainText;
  };

  return (
    <section
      onClick={props.expandNote}
      className="note-thumbnail-container z-depth-2"
    >
      <p className="note-thumb-text thumb-date">
        created at:&nbsp;{moment(props.created).format("LLL")}
      </p>
      <p className="note-thumb-text thumb-date">
        udpdated at:&nbsp;{moment(props.updated).format("LLL")}
      </p>
      <h1 className="note-thumb-text thumb-title">{props.name}</h1>
      <p className="note-thumb-text thumb-body">{previewText(props.body)}</p>
    </section>
  );
};

export default NoteListItem;
