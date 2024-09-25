const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware to allow frontend to interact with backend
app.use(cors());

//Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'moviecritic',
});

//Routes
//Get specific elokuva's image
app.get('/elokuva/:id/kuva', (req, res) => {
  db.query('SELECT kuva FROM elokuva WHERE id = ' + req.params.id, (err, rows) => {
    if (err) {
      return console.error('Error in image search: ' + err);
    }
    return res.send(rows[0].kuva)
  })
})

//Get specific elokuva
app.get('/elokuva/:id', (req, res) => {
  db.query('SELECT * FROM elokuva WHERE id = ' + req.params.id, (err, rows) => {
    if (err) {
      return console.error('Error in id select: ' + err);
    }
    return res.json(rows);
  });
  });

//Get all rows from Jasen
app.get('/jasen', (req, res) => {
  db.query('SELECT * FROM jasen', (err, rows) => {
    if (err) {
      return console.error('Error in query: ' + err);
    }
    return res.json(rows);
  });
});
//Get all rows from Elokuva
app.get('/elokuva', (req, res) => {
  db.query('SELECT * FROM elokuva', (err, rows) => {
    if (err) {
      return console.error('Error in query: ' + err);
    }
    return res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port + ${PORT}`);
});






