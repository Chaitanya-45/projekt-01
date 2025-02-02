// routes/calendar.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

// Get all events for the logged-in user
router.get('/events', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new event for the logged-in user
router.post('/events', auth, async (req, res) => {
  const { title, start, end } = req.body;

  try {
    const user = await User.findById(req.user.id);
    user.events.push({ title, start, end });
    await user.save();
    res.json(user.events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an event for the logged-in user
router.delete('/events/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.events = user.events.filter(event => event._id.toString() !== req.params.id);
    await user.save();
    res.json(user.events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;