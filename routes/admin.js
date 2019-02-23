const mongoose = require('mongoose');
require('../models/Project');
require('../models/User');
const User = mongoose.model('users');
const Project = mongoose.model('projects');

module.exports = {
    assignProject: async(req, res) => {

            //console.log(req.body.user);
            //console.log(req.body.project);
            User.findOne({_id: req.body.user, typeOfUser: "Admin"})
            .then(user=>{
                if(user){
                Project.update({ _id: req.body.project }, { $set: { user: req.body.user } });
                res.send({ message: 'Successfully transferred!' });
                }else{
                    res.send({message: 'Invalid Input'});
                }
            }).catch(err => console.log(err))
            
    }
};
