const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  details:{
    type: String,
    required: true
  },
  user:{
    type: String,
    required:true
  },
  date: {
    type: Date,
    default: Date.now
  },
  apis: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Api'
  }]
});

mongoose.model('projects', ProjectSchema);