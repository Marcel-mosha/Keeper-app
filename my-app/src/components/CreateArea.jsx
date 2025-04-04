import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function CreateArea(props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState({ title: "", content: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevNote) => {
      return { ...prevNote, [name]: value };
    });
  }

  function submitNote(event) {
    props.onAdd(note);
    setNote({ title: "", content: "" });
    setIsExpanded(false);
    event.preventDefault();
  }

  function handleExpand() {
    setIsExpanded(true);
  }

  return (
    <Box sx={{ mb: 4 }}>
      <form
        className="create-note"
        style={{
          width: "calc(100% - 32px)",
          margin: "16px auto",
          maxWidth: "480px",
        }}
      >
        {isExpanded && (
          <TextField
            fullWidth
            variant="outlined"
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
            size="small"
            sx={{ mb: 1 }}
          />
        )}
        <TextField
          fullWidth
          variant="outlined"
          multiline
          name="content"
          onChange={handleChange}
          onClick={handleExpand}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />
        {isExpanded && (
          <IconButton
            aria-label="add"
            color="primary"
            onClick={submitNote}
            sx={{
              position: "absolute",
              right: 18,
              bottom: -18,
              backgroundColor: "#3828c4",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#2819a8",
              },
            }}
          >
            <AddIcon />
          </IconButton>
        )}
      </form>
    </Box>
  );
}

export default CreateArea;
