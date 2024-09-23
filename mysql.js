const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

//Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'moviecritic',
});

//Routes
//Get all rows from Jasen
app.get('/jasen', (req, res) => {
  db.query('SELECT * FROM jasen', (err, data) => {
    if (err) {
      console.log('Error in query: ' + err);
      return;
    }
    return res.json(data);
  });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port + ${PORT}`);
});






