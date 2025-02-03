const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  email: { type: String, required: true },
  task: { type: String, required: true },
  status: { type: String, default: "In Progress" },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  team: [teamMemberSchema],
  completionPercentage: { type: Number, default: 0 },
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;