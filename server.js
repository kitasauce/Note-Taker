const express = require('express');
const html_routes = require('./routes/html-routes')
const api_routes = require('./routes/api-routes')
const PORT = process.env.PORT || 3001;
const { v4: uuidv4 } = require('uuid');


const app = express();
const fs = require ('fs')
const path = require ('path')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(html_routes)


// Since the GET and POST functions grab from the same route, we can set it once up here.
app.route("/api/notes")
    // Grab the notes list (this should be updated for every new note and deleted note.)
    .get(function (req, res) {
        fs.readFile ("./db/db.json",  (err, data) => {
            if (err) {
                throw err
            }
res.send (data)
         })

            
    })

    // Add a new note to the json db file.
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;
        console.log (req.body)
        fs.readFile ("./db/db.json",  (err, data) => {
            if (err) {
                throw err
            }
            let database=JSON.parse(data)
            console.log (newNote)
            newNote.id = uuidv4(); 
            database.push(newNote)
            fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {
    
                if (err) {
                    return console.log(err);
                }
                console.log("Your note was saved!");
                res.json(newNote);
            });
         })
    });

// Delete the  note
const handleNoteDelete = (x) => {
    e.stopPropagation();
  
    const note = x.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data')).id;
  
    if (activeNote.id === noteId) {
      activeNote = {};
    }
  
    deleteNote(noteId).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});