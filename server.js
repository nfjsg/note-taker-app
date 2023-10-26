
// Import required modules and packages
const express = require('express'); // Express.js for creating a web server
const fs = require('fs'); // File system module for file operations
const path = require('path'); // Path module for working with file paths
const uuid = require('uuid'); // UUID package for generating unique IDs

// Create an instance of the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON data
app.use(express.json());

// Serve the notes.html file for the "/notes" route
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notes.html'));
});

// Serve the index.html file for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API route to get all notes from db.json
app.get('/api/notes', (req, res) => {
  // Read notes from the db.json file and send them as a JSON response
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'));
  res.json(notes);
});

// API route to save a new note
app.post('/api/notes', (req, res) => {
  // Read the existing notes from db.json
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'));
  // Generate a unique ID using UUID
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text,
  };
  // Add the new note to the array of notes
  notes.push(newNote);
  // Write the updated notes back to db.json
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes));
  // Send the new note as a response
  res.json(newNote);
});

// Define an API route to delete a note by its ID (you need to implement this)
// API route to delete a note by its ID
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id; // Get the ID from the URL parameter

  // Read the existing notes from db.json
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'));

  // Find the index of the note to delete by matching its ID
  const noteIndex = notes.findIndex((note) => note.id === noteId);

  if (noteIndex === -1) {
    // If the note with the given ID is not found, send a 404 response
    res.status(404).json({ message: 'Note not found' });
  } else {
    // Remove the note from the array
    notes.splice(noteIndex, 1);
    // Write the updated notes back to db.json
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes));
    // Send a success response
    res.json({ message: 'Note deleted successfully' });
  }
});

// Start the Express server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
