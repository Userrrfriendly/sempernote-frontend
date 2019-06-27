import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Select, { components } from "react-select";
import { withRouter } from "react-router-dom";
import { selectNotebook } from "../../helpers/helpers";
import { LibraryBooksRounded } from "@material-ui/icons";
import { Typography, TextField, Tooltip, Button } from "@material-ui/core";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "85%",
    minHeight: "30vh",
    maxHeight: "calc(100vh - 30%)",
    boxShadow:
      " 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)",
    overflow: "visible",
    borderRadius: "4px"
  },
  overlay: { zIndex: 1302 }
};

//Custom Icon for React-Select
const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <Tooltip title="Select Notebook">
        <LibraryBooksRounded style={{ color: "#202020" }} />
      </Tooltip>
    </components.DropdownIndicator>
  );
};

//requirement for react-modal
Modal.setAppElement("#root");

const NoteModal = props => {
  const [title, setTitle] = useState("");
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [options, setOptions] = useState(
    props.notebooks.map(notebook => {
      return { value: notebook._id, label: notebook.name };
    })
  );

  useEffect(() => {
    console.log("useEffect from note modal (options || notebooks) changed");
    //check if a notebook was renamed
    // options.length !== props.notebooks.length &&
    //   setOptions(
    //     props.notebooks.map(notebook => {
    //       return { value: notebook._id, label: notebook.name };
    //     })
    //   );
    setOptions(
      props.notebooks.map(notebook => {
        return { value: notebook._id, label: notebook.name };
      })
    );
    setSelectedNotebook(options[0]);
    // setSelectedNotebook(context.activeNotebook ? {value:context.activeNotebook._id,label:context.activeNotebook.name} :options[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.notebooks]);

  const handleSelectChange = selectedNotebook => {
    setSelectedNotebook(selectedNotebook);
    // console.log(`Option selected:`, selectedNotebook);
  };

  const onTitleChange = e => {
    if (e.target.value.length < 100) {
      setTitle(e.target.value);
    }
  };

  const onSubmit = e => {
    e.preventDefault();

    const existingNotes = props.notes.reduce((accumulator, currentValue) => {
      if (currentValue.notebook.name === selectedNotebook.label) {
        accumulator.push(currentValue.title.toLowerCase());
      }
      return accumulator;
    }, []);

    // IF NOTE WITH THE SAME NAME EXISTS ADD A SUFFIX to the new note(myNote->myNote1, myNote1->myNote2, myNote2->myNote3)
    const initialTitle = title ? title : "Untitled Note";
    let index = 1;
    let validatedTitle = initialTitle;
    while (index) {
      if (existingNotes.includes(validatedTitle.toLowerCase())) {
        validatedTitle = validatedTitle.slice(0, initialTitle.length) + index;
        index++;
      } else {
        index = false;
      }
    }

    let path = `/main/editor`;

    const newNote = {
      title: validatedTitle,
      _id: validatedTitle,
      body: JSON.stringify('"{"ops":[{"insert":"\\n"}]}"'),
      createdAt: "",
      temp: true,
      notebook: {
        ...selectNotebook(props.notebooks, selectedNotebook.value)[0]
      }
    };
    console.log(newNote);
    /**
     * SetActiveNote(tempNote created on the client)->opens editor
     * SetActiveNote(actual note as response from server)->opens editor again/rerender
     */
    const updateState = async () => {
      props.pushNoteToState(newNote);
    };
    updateState()
      .then(props.setActiveNote(validatedTitle))
      .then(props.history.push(path))
      .then(props.pushNoteToServer(newNote))
      .then(setTitle(""))
      .then(props.closeModal())
      .catch(error => console.log(error));
  };

  return (
    <div>
      <Modal
        isOpen={props.isOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={props.closeModal}
        style={customStyles}
        contentLabel="Create Note" //improves accessibility
      >
        <form onSubmit={onSubmit}>
          <div className="modal-content1">
            <Typography variant="h4" component="h1">
              Create Note
            </Typography>
            <div>
              <TextField
                autoFocus
                margin="dense"
                label="Note Title"
                type="text"
                fullWidth
                value={title}
                onChange={onTitleChange}
                placeholder="Enter Note Title"
              />

              <Typography variant="subtitle2" component="p">
                Select Notebook
              </Typography>
              <Select
                aria-label={"select notebook"}
                defaultValue={options[0]}
                isSearchable={true}
                onChange={handleSelectChange}
                options={options}
                components={{ DropdownIndicator }}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <Button type="button" onClick={props.closeModal} color="primary">
              Cancel
            </Button>
            <Button type="submit" onClick={onSubmit} color="primary">
              Create Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default withRouter(NoteModal);
