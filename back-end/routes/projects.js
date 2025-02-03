const express = require("express");
const Project = require("../models/project");
const User = require("../models/user");
const router = express.Router();

// Create a new project
router.post("/", async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    const project = new Project({ name, description, createdBy: userId });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get projects created by the logged-in user
router.get("/created/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ createdBy: userId });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get projects assigned to the logged-in user
router.get("/assigned/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const projects = await Project.find({ "team.email": user.email });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a team member to a project
router.post("/:projectId/team", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, task, status } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.team.push({ email, task, status });
    await project.save();

    // Send notification to the user
    const user = await User.findOne({ email });
    if (user) {
      user.notifications.push({ message: `You have been added to the project: ${project.name}` });
      await user.save();
    }

    res.status(200).json({ team: project.team });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get team members of a project
router.get("/:projectId/team", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ team: project.team });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;