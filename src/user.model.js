import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

//password encryption
const saltRounds = 10;

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


  // create: (userDetails) => {

  //    // Store hash in your password DB.
  //    //const  salt = bcrypt.genSaltSync(saltRounds); 
  //    //const  hash = bcrypt.hashSync(userDetails.password, salt);
  //   const hash = bcrypt.hashSync(userDetails.password, saltRounds);
  //   console.log(hash);

  //   const user = {
  //     'firstName':userDetails.firstName,
  //     'lastName':userDetails.lastName,
  //     'email':userDetails.email,
  //     'country':userDetails.country,
  //     'password': hash
  //   }

  //   // UserModel.insert(user, (err,res) => {
  //   //   if(err) {
  //   //     console.log('Failed to insert in db');
  //   //   } else {
  //   //     console.log('Data inserted successfully in db');
  //   //   }
  //   // })
  // },

  // find: (email) => {
  //  return UserModel.findOne(email);  
  // },



module.exports = UserModel;