const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON and URL encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
// Middleware to allow frontend to interact with backend
app.use(cors());
// Middleware to manage movie image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'moviecritic',
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token missing'});
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token'});
  };
};

// Routes
// Member login
app.post('/login', (req, res) => {
  const {sahkopostiosoite, salasana} = req.body;
  
  db.query('SELECT * FROM jasen WHERE sahkopostiosoite = ?', [sahkopostiosoite], async (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging in: ' + err});
    }

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password'});
    }

    const member = rows[0];
    const validPassword = await bcrypt.compare(salasana, member.salasana);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password'});
    }

    const memberToken = {id: member.id, sahkopostiosoite: member.sahkopostiosoite};
    const token = jwt.sign(memberToken, process.env.SECRET, {expiresIn: '1h'});
    console.log('token: ' + token);
    console.log('secret: ' + process.env.SECRET)
    res.status(200).json({ token });
  });
});

// Add Member
app.post('/jasen', async (req, res) => {
  const { sahkopostiosoite, salasana, nimimerkki, liittymispaiva} = req.body;
  console.log(req.body)
  try {
    const hashedPassword = await bcrypt.hash(salasana, 10);
    const newMember = {
      sahkopostiosoite,
      salasana: hashedPassword,
      nimimerkki,
      liittymispaiva
    };
    console.log(newMember);
    db.query('INSERT INTO jasen SET ?', newMember, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error adding member: ' + err});
      }
      res.status(201).json({ message: 'Member added succesfully!'});
    })
  } catch (error) {
    res.status(500).json({ error: 'Error in adding process'});
  };
});

// Get specific member
app.get('/jasen/:id', (req, res) => {
  const memberId = req.params.id;

  db.query('SELECT * FROM jasen WHERE id = ?', [memberId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error in member search: ' + err });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.status(200).json(rows[0]);
  });
});

// Update specific member's profile details
app.put('/jasen/:id', authenticateToken, (req, res) => {
  const memberId = req.params.id;
  const {
    nimimerkki,
    sukupuoli,
    paikkakunta,
    harrastukset,
    suosikkilajityypit,
    suosikkifilmit,
    omakuvaus
  } = req.body;

  const details = {
    nimimerkki,
    sukupuoli,
    paikkakunta,
    harrastukset,
    suosikkilajityypit,
    suosikkifilmit,
    omakuvaus
  };

  db.query('UPDATE jasen SET ? WHERE id = ?', [details, memberId], (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error updating profile details: ' + err });
    }
    res.status(200).json({ message: 'Profile details updated succesfully!' });
  });
});

// Get all rows from Jasen
app.get('/jasen', (req, res) => {
  db.query('SELECT * FROM jasen', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error in query: ' + err });
    }
    res.status(200).json(rows);
  });
});

// Get all rows from Elokuva
app.get('/elokuva', (req, res) => {
  db.query('SELECT * FROM elokuva', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error in query: ' + err });
    }
    res.status(200).json(rows);
  });
});

// Get specific movie's image
app.get('/elokuva/:id/kuva', (req, res) => {
  const imageId  = req.params.id;
  db.query('SELECT kuva FROM elokuva WHERE id = ?', [imageId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error:'Error in image search: ' + err});
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.status(200).send(rows[0].kuva);
  });
});

// Get specific movie
app.get('/elokuva/:id', (req, res) => {
  const movieId = req.params.id;

  db.query('SELECT * FROM elokuva WHERE id = ?', [movieId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error in movie search: ' + err });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(rows);
  });
});

// Add a movie
app.post('/elokuva', authenticateToken, upload.single('kuva'), (req, res) => {
  const {
    alkuperainennimi,
    suomalainennimi,
    lajityyppi,
    valmistumisvuosi,
    pituus,
    ohjaaja,
    kasikirjoittajat,
    paanayttelijat,
    kieli,
    kuvaus,
  } = req.body;
  const kuva = req.file;

  const movie = {
    alkuperainennimi,
    suomalainennimi,
    lajityyppi,
    valmistumisvuosi,
    pituus,
    ohjaaja,
    kasikirjoittajat,
    paanayttelijat,
    kieli,
    kuvaus,
    kuva: kuva.buffer
  };

  db.query('INSERT INTO elokuva SET ?', movie, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding movie: ' + err });
    }
    res.status(201).json({ message: 'Movie added successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port + ${PORT}`);
});






