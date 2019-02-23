const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
const api = require('./api'); 
const admin = require('./admin');

require('../models/Project');
const Project = mongoose.model('projects');

// Idea Index Page
// router.get('/', ensureAuthenticated, (req, res) => {
//   Project.find({user: req.user.id})
//     .sort({date:'desc'})
//     .then(projects => {
//       res.send({
//         projects:projects
//       });
//     });
// });

// router.get('/add', ensureAuthenticated, (req, res) => {
//   res.render('projects/add');
// });

// router.get('/edit/:id', ensureAuthenticated, (req, res) => {
//   Project.findOne({
//     _id: req.params.id
//   })
//   .then(project => {
//     if(project.user != req.user.id){
//       res.send({ message: "Unsuccessful"});
//     } else {
//       res.render('projects/edit', {
//         project:project
//       });
//     }
    
//   });
// });

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  //console.log(req.body.title);
  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    res.json( {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Project(newUser)
      .save();
      res.json({message : "Project created successfully"});
  }
});

// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  console.log(req.params.id);
  Project.findOne({
    _id: req.params.id
  })
  .then(project => {
    // new values
    project.title = req.body.title;
    project.details = req.body.details;
    console.log(project);
    project.save({_id: req.params.id})
      .then(project => {
        res.json({message:"Update successful", project: project});
      }).catch(err => res.send(err));
  });
});


router.delete('/:id', ensureAuthenticated, (req, res) => {
  console.log(req.params.id);
  Project.remove({_id: req.params.id})
    .then(() => {
      res.json({message: "Project removed"});
    }).catch(err => {
      res.send(err);
    });
});

//Handle api requests



router.post('/api', ensureAuthenticated, api.createApi);
router.get('/api/:projectID', ensureAuthenticated, api.getApis);

module.exports = router;