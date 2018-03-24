import express from ('express');
const app = express();

//import expressValidator from ('express-validator');
import mongoose from ('mongoose');
import Config from ('./config');
import User from ('./user.model');

// Connect to MongoDB
const mongoDB = Config.DB

mongoose.connect(mongoDB);
const dbConnection = mongoose.connection;
dbConnection.on('error', (err) => {
  logger.error('Unable to connect to MongoDB', err);
});
dbConnection.once('open', () => {
  logger.info('Connected to MongoDB');
});

/**
* 
*/
app.post('/signUp', (req,res) => {
  console.log('Validating parameters');

  req.sanitize('name').trim();
  req.sanitize('emailId').trim();
  req.sanitize('password').trim();

  req.checkBody({
    name: {
      notEmpty: true,
      errorMessage: 'Name field can not be blank',
    },
    email: {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Invalid email',
      },
      errorMessage: 'Email cannot be blank'
    },
    password: {
      isLength: true,
      //options: { min: 5 },
      errorMessage: 'Password should be at least 5 chars long',
    }
  });

  req.getValidationResult()
    .then(results => {
      if(!results.isEmpty()) {
        throw new Error('Validation error');
      } else {
        console.log('Validation successful');
        return User.create(req.body)
      }
    })
    .then(() => {
      console.log('Inserted Successfully');
      res.sendStatus(201);
    })
    .catch(() => {
      res.sendStatus(500);
    })
  })


