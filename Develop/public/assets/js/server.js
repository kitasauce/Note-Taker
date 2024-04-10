const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// GET /notes route
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/notes.html');
});

// GET * route
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// GET /api/notes route
app.get('/api/notes', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (parseErr) {
      console.error(parseErr);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// POST /api/notes route
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Generate unique ID for the note
  
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    try {
      const notes = JSON.parse(data);
      notes.push(newNote);
      fs.writeFile('db.json', JSON.stringify(notes), (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.json(newNote);
      });
    } catch (parseErr) {
      console.error(parseErr);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
