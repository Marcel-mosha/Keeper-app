import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

function Note(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedContent, setEditedContent] = useState(props.content);
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedTitle(props.title);
    setEditedContent(props.content);
  };
  const handleSaveClick = () => {
    const updatedNote = {
      id: props.id,
      title: editedTitle,
      content: editedContent,
    };
    props.onEdit(updatedNote);
    setIsEditing(false);
  };
  const handleDeleteClick = () => {
    props.onDelete(props.id);
  };

  return (
    <div className="note" style={{ width: "240px", height: "240px" }}>
      {isEditing ? (
        <>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </Box>
          <div className="note-footer">
            <IconButton
              onClick={handleCancelClick}
              aria-label="cancel"
              color="secondary"
            >
              <CancelIcon />
            </IconButton>
            <IconButton
              onClick={handleSaveClick}
              aria-label="save"
              color="primary"
            >
              <SaveIcon />
            </IconButton>
          </div>
        </>
      ) : (
        <>
          <div className="note-content">
            <h1>{props.title}</h1>
            <p>{props.content}</p>
          </div>
          <div className="note-footer">
            <IconButton
              onClick={handleEditClick}
              aria-label="edit"
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={handleDeleteClick}
              aria-label="delete"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
}

export default Note;
