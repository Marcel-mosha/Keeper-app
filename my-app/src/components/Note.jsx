import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <div className="note">
      <div className="note-content">
        <h1>{props.title}</h1>
        <p>{props.content}</p>
      </div>
      <div className="note-footer">
        <IconButton onClick={handleClick} aria-label="delete" color="error">
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Note;
