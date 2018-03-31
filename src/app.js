import express from 'express'; // call express
const app = express(); //init app
import bcrypt from 'bcryptjs';

import { check, validationResult } from 'express-validator/check';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
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

//use middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const saltRounds = 10;

/**
 * @api {Post} /signUp Register a new User
 * @apiVersion 1.0.0
 * @apiName PostUser
 * @apiGroup UserRegistration
 *
 * @apiParam {String} firstName Mandatory First Name of User
 * @apiParam {String} [lastName] Last Name of user
 * @apiParam {String} [country] Country of user
 * @apiParam {String} email Mandatory EmailId of user
 * @apiParam {Number} password Mandatory Password
 *
 * @apiSuccess (Success 201) - No Content
 *
 * @apiError (Error 500) - Internal Server Error
 */
app.post('/signUp', [
  check('firstName').exists().isLength({min:1}).withMessage('Name field can not be blank').trim(),
  check('email').isEmail().withMessage('Must be an email').trim()
    .custom(value => {
      const email = Object.assign({email:value});

      return User.findOne(email)
      .then(user => {
        if(user)
         throw new Error('this email is already in use');
      })
    }),
  check('country').exists().withMessage('Country is required').trim(),
  check('password', 'passwords must be at least 5 chars long and contain one number').isLength({ min: 5 }).matches(/\d/),
  ], (req, res) => {
  console.log('Validating parameters');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const data = Object.assign({}, req.body, {
    password: bcrypt.hashSync(req.body.password, saltRounds),
  });

  User.create(data)
    .then(() => {
      console.log('User registered successfully');

      res.sendStatus(201);
    })
    .catch(ex => {
      res.sendStatus(500);
    });
});


/**
 * @api {Get} /logIn  User login
 * @apiVersion 1.0.0
 * @apiName GetData
 * @apiGroup UserLogin
 *
 * @apiParam {String} email Mandatory EmailId of user
 * @apiParam {Number} password Mandatory Password
 *
 * @apiSuccess (Success 201) - No Content
 *
 * @apiError (Error 500) - Internal Server Error
 */
app.post('/logIn', [
  check('email').isEmail().withMessage('must be an email').trim(),
  check('password').exists().withMessage('password can not be blank')
  ], (req, res) => {
  console.log('Validating user credentials');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const findEmail = Object.assign({email:req.body.email});

  User.findOne(findEmail)
    .then(user => {
      const matchedUserHash = user.password || '';

      //compare password with stored decrypted password
      const compareResult = bcrypt.compareSync(req.body.password, matchedUserHash);
      if(compareResult) {
        console.log('Passsword matched successfully');
        //create token
        const token = jwt.sign({ sub: user._id }, 'qwertyuirtyu', { algorithm: 'HS384'});
       
        res.status(200).send(token);
      } else {
        console.log('Passsword matched failed');
        res.sendStatus(401);
      }
    })
    .catch(ex => {
      console.log('User not registered with us');
      res.sendStatus(404);
    });
});


//server setup
const server = app.listen(Config.serverPort, () => {
  const port = server.address().port;
  console.log('App is listening on port', port);
})



