import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import Footer from "./footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

const API_URL = "http://localhost:5000/notes";

function App() {
  const [notes, setNotes] = useState([]);

  // Fetch notes from backend
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setNotes(response.data))
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  // Add note
  function addNote(newNote) {
    axios
      .post(API_URL, newNote)
      .then((response) => setNotes([...notes, response.data]))
      .catch((error) => console.error("Error adding note:", error));
  }
function editNote(updatedNote) {
  axios
    .patch(`${API_URL}/${updatedNote.id}`, {
      title: updatedNote.title,
      content: updatedNote.content,
    })
    .then(() => {
      setNotes(
        notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );
    })
    .catch((error) => console.error("Error updating note:", error));
}
  // Delete note
  function deleteNote(id) {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => setNotes(notes.filter((note) => note.id !== id)))
      .catch((error) => console.error("Error deleting note:", error));
  }

  return (
    <div className="app-container">
      <Header />
      <div className="content-wrap">
        <CreateArea onAdd={addNote} />
        <div className="notes-container">
          {notes.map((noteItem, index) => {
            return (
              <Note
                key={index}
                id={noteItem.id}
                title={noteItem.title}
                content={noteItem.content}
                onDelete={deleteNote}
                onEdit={editNote}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
