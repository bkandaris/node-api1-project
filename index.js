// implement your API here

// first we need to bring in the 'express JS' library
// npm install --save express
const express = require('express');
// creating an instance of express
const server = express();
// bring in 'db.js' file / functions
const db = require('./data/db');
// declaring our port
const port = 8000;
// this is middleware that allows express...
// to parse JSON req bodies (what we want for our post endpoint)
server.use(express.json());

// running a quick test to see if it's working
server.get('/test', (req, res) => {
  res.redirect('http://google.com');
});

// writing all of our endpoints (5 of them)
// post request that creates a user using information sent inside of the 'request body'
server.post('/api/users', (req, res) => {
  if (req.body.name && req.body.bio) {
    const newUser = {
      name: req.body.name,
      bio: req.body.bio
    };
    db.insert(newUser);
    res.status(201).json(newUser);
  } else if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ message: 'Please provide name and bio for the user' });
  }
  console.log(req.body);
});

server.get('/api/users', (req, res) => {
  db.find()
    .then(response => {
      console.log(response);
      res.status(201).json(response);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: 'The users information could not be retrieved' });
    });
});

server.get('/api/users/:id', (req, res) => {
  console.log('something');
  db.findById(req.params.id)
    .then(user => {
      console.log(user);
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be retrieved' });
    });
});

server.delete('/api/users/:id', (req, res) => {
  db.remove(req.params.id)
    .then(userId => {
      console.log(userId);
      if (!userId) {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      } else {
        res.status(200).json({ message: 'user was deleted' });
      }
    })
    .catch(err => {
      console.log(err);
      status(500).json({ message: 'The user could not be removed' });
    });
});

server.put('/api/users/:id', (req, res) => {
  console.log(req.body);
  const user = req.body;
  db.update(req.params.id, user)
    .then(users => {
      console.log(users);
      if (req.body.name && req.body.bio) {
        res.status(200).json({ message: 'user updated' });
      } else if (!req.body.name || !req.body.bio) {
        res
          .status(400)
          .json({ errorMessage: 'please provide name and bio for the user' });
      } else {
        res
          .status(404)
          .json({ message: 'the user with the specified ID does not exist' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be modified' });
    });
});

// starting the server on localhost port 8000
server.listen(port, () => {
  console.log('server is listening on port 8000');
});
