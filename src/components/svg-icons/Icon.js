import React from "react";

import Allnotes from "./allnotes/allnotes";
import Bookmarks from "./bookmarks/bookmarks";
import Notebooks from "./notebooks/notebooks";
import Tags from "./tags/tags";
import Trash from "./trash/trash";
import CloseIcon from "./closeIcon/closeIcon";
import CreateNote from "./createNote/createNote";

const Icon = props => {
  switch (props.name) {
    case "allnotes":
      return <Allnotes {...props} />;
    case "bookmarks":
      return <Bookmarks {...props} />;
    case "notebooks":
      return <Notebooks {...props} />;
    case "tags":
      return <Tags {...props} />;
    case "trash":
      return <Trash {...props} />;
    case "closeIcon":
      return <CloseIcon {...props} />;
    case "createNote":
      return <CreateNote {...props} />;
    default:
      return;
  }
};

export default Icon;
