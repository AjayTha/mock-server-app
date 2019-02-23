const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Login Route
// router.get('/login', (req, res) => {
//   res.render('users/login');
// });

// router.get('/adminLogin', (req, res) => {
//   res.render('users/adminLogin');
// });

//User Register Route
// router.get('/register', (req, res) => {
//   res.render('users/register');
//});

// Login Form POST
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      // *** Display message without using flash option
      // re-render the login form with a message
      return res.json({ message: "Login unsuccessful" })
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
       return res.json({message: "Login successful"});
    });
  })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];
  //console.log(req.body);
  if(req.body.password != req.body.password2){
    errors.push({text:'Passwords do not match'});
  }

  if(req.body.password.length < 4){
    errors.push({text:'Password must be at least 4 characters'});
  }

  if(errors.length > 0){
    res.json({
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({email: req.body.email, typeOfUser: 'User'})
      .then(user => {
        if(user){
          req.flash('error_msg', 'Email already regsitered');
          res.json({message: "User already registered"});
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            typeOfUser: 'User'
          });
          
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  //req.flash('success_msg', 'You are now registered and can log in');
                  res.json({message: "User registration successful", user: user});
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

router.post('/adminLogin', (req, res) => {
    User.findOne({email: req.body.email, typeOfUser: 'Admin', password: req.body.password})
      .then(user => {
        if(user){
          res.json({message: "Login successful", user: user});
        } else {
          //req.flash('error_msg', 'Not Authorized');
          res.json({message: "Invalid Credentials"});
        }
      });
  
});


// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  //req.flash('success_msg', 'You are logged out');
  res.json({ message: "Logout successful"});
});

module.exports = router;