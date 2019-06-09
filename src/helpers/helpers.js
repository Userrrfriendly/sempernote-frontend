//arrayToObject turns an array of objects into an object with keyField (_id) as keys
export const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});

//mergeNotes takes an array of notebooks and turns it into an array of notes.
export const mergeNotes = array =>
  array.reduce((accumulator, currentValue) => {
    accumulator.push(currentValue.notes);
    //The flat() method creates a new array with all sub-array elements concatenated into it recursively & removes empty slots in arrays.
    return accumulator.flat();
  }, []);

//removes unnesessary data from notebooks.notes and leaves only _id and title
export const simplifyNotebooks = array =>
  array.map(notebook => {
    return {
      ...notebook,
      notes: notebook.notes.map(note => {
        return { _id: note._id, title: note.title };
      })
    };
  });

export const selectNotebook = (arrayOfNotebooks, notebookID) =>
  arrayOfNotebooks.filter(notebook => notebook._id === notebookID);

//shortByDate accepts a key just in case it needs to update by createdAt and not updatedAt
//also don't forget that array.short() is an In-place algorithm and it returns the shorted array
export const sortByDateNewestFirst = (arrOfObjects, key) =>
  arrOfObjects.sort(
    (a, b) => new Date(b[key]).getTime() - new Date(a[key]).getTime()
  );

export const sortByDateOldestFirst = (arrOfObjects, key) =>
  arrOfObjects.sort(
    (a, b) => new Date(a[key]).getTime() - new Date(b[key]).getTime()
  );

export const sortByTitleAsc = arrOfObjects =>
  arrOfObjects.sort((a, b) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    // names must be equal
    return 0;
  });

export const sortByTitleDes = arrOfObjects =>
  arrOfObjects.sort((a, b) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    if (titleB < titleA) {
      return -1;
    }
    if (titleB > titleA) {
      return 1;
    }
    // names must be equal
    return 0;
  });

export const sortByNotebookName = arrOfObjects =>
  arrOfObjects.sort((a, b) => {
    const nameA = a.notebook.name.toUpperCase();
    const nameB = b.notebook.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // if names are equal return 0 that doesnt change the order
    return 0;
  });
