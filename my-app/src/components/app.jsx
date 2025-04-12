import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Remove Router from imports
import axios from "axios";
import Header from "./header";
import Footer from "./footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Login from "./Login";
import Register from "./Register";

const API_URL = "http://192.168.1.164:5000/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  // Check for existing token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch notes when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotes();
    }
  }, [isLoggedIn]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogin = (newToken, newUsername) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    setToken(newToken);
    setUsername(newUsername);
    setIsLoggedIn(true);
  };

  const handleRegister = (newToken, newUsername) => {
    handleLogin(newToken, newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setUsername("");
    setIsLoggedIn(false);
    setNotes([]);
  };

  // Add note
  const addNote = async (newNote) => {
    try {
      const response = await axios.post(API_URL, newNote, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes([...notes, response.data]);
    } catch (error) {
      console.error("Error adding note:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Edit note
  const editNote = async (updatedNote) => {
    try {
      await axios.patch(
        `${API_URL}/${updatedNote.id}`,
        {
          title: updatedNote.title,
          content: updatedNote.content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes(
        notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );
    } catch (error) {
      console.error("Error updating note:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  return (
    <div className="app-container">
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
      />
      <div className="content-wrap">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <>
                  <CreateArea onAdd={addNote} />
                  <div className="notes-grid">
                    {notes.map((noteItem, index) => (
                      <Note
                        key={index}
                        id={noteItem.id}
                        title={noteItem.title}
                        content={noteItem.content}
                        onDelete={deleteNote}
                        onEdit={editNote}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
