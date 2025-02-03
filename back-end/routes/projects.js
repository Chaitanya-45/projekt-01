const express = require("express");
const Project = require("../models/project");
const router = express.Router();

// Create a new project
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = new Project({ name, description });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
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

// Update the status of a team member's task
router.put("/:projectId/team/:memberEmail", async (req, res) => {
  try {
    const { projectId, memberEmail } = req.params;
    const { status } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const member = project.team.find(member => member.email === memberEmail);
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }
    member.status = status;
    await project.save();
    res.status(200).json({ team: project.team });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;