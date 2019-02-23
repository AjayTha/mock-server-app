
//const response = require('./../../../config/response');
const mongoose = require("mongoose");
require('../models/Project');
require('../models/Api');
const Api = mongoose.model('Api');
const Project = mongoose.model('projects');
module.exports = {
    createApi: async(req, res) => {
        try {
            //console.log(req.body);
            if (req.body) {
                
                // const _api =  Api.findOne({ project: req.body.project, 'req.method': req.body.req.method, 'req.path': req.body.req.path });
                // if (_api){
                //     console.log(_api);
                //      return res.json({ message: 'Api Already exists!' });
                // }
                
                let api = new Api();
                api.req = req.body.req;
                api.res = req.body.res;
                api.res.body = JSON.stringify(req.body.res.body);
                api.project = req.body.project;
                api.save();
                //console.log(api._id);
                //console.log(req.body.project);
                Project.update({ _id: req.body.project }, { $push: { "apis": api._id } })
                .then(api =>{
                    res.json({ data: api, info: 'Successfully Created!' });
                }).catch(err => console.log(err));
                
            }
            else {
                res.json({ message: 'Invalid Input' });
            }
        }
        catch (error) {
                res.error(error);
        }
    },
    
    getApis: async(req, res) => {
            Api.find({ project: req.params['projectID'] })
            .then(r =>{
                res.send(r);
            }).then(err => res.send(err));
        
        
    }

};
