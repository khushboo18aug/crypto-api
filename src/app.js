import express from 'express';
const app = express();

import expressValidator from 'express-validator';
import { check, validationResult } from 'express-validator/check';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import Config from './config';
import User from './user.model';

// Connect to MongoDB
const mongoDB = Config.DBURI;

mongoose.connect(mongoDB);
const dbConnection = mongoose.connection;
dbConnection.on('error', (err) => {
  console.log('Unable to connect to MongoDB', err);
});
dbConnection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

/**
* 
*/
app.post('/signUp',[
  check('firstName').exists().withMessage('Name field can not be blank').trim(),
  check('email').isEmail().withMessage('must be an email').trim(),
  check('password').exists().withMessage('password can not be blank')
  ], (req,res) => {
  console.log('Validating parameters', req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  User.create(req.body)
    .then(() => {
      console.log('Inserted Successfully');
      res.sendStatus(201);
    })
    .catch(() => {
      res.sendStatus(500);
    })
});

//server setup
const server = app.listen(Config.serverPort, () => {
  const port = server.address().port;
  console.log('App is listening on port', port);
})





