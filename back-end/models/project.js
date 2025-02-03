const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  team: [
    {
      email: String,
      task: String,
      status: {
        type: String,
        default: 'In Progress',
      },
    },
  ],
});

module.exports = mongoose.model('Project', ProjectSchema);