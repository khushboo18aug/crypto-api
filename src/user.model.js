import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const registeredUserSchema = new Schema ({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

const UserModel = mongoose.model('UserModel', registeredUserSchema);

const fns =  {
  create: (userDetails) => {
    const user = {
      'firstName':userDetails.firstName,
      'lastName':userDetails.lastName,
      'email':userDetails.email,
      'country':userDetails.country,
      'password': userDetails.password,
    }

    UserModel.insert(user, (err,res) => {
      if(err) {
        console.log('failed to insert');
      } else {
        console.log('inserted successfully');
      }
    })
  },
};

module.exports = UserModel;