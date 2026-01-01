const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/create-or-update', async (req, res) => {
  const {
    clerkId,
    email,
    firstName,
    lastName,
    image,
    sports,
    provider,
  } = req.body;

  if (!clerkId || !email || !firstName || !image) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let user = await User.findOne({ clerkId });

    if (user) {

      user.firstName = firstName;
      user.lastName = lastName;
      user.image = image;
      user.sports = sports;
      await user.save();
    } else {

      user = await User.create({
        clerkId,
        email,
        firstName,
        lastName,
        image,
        sports,
        provider,
      });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Error creating/updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/:clerkId', async (req, res) => {
  const { clerkId } = req.params;

  try {
    const user = await User.findOne({ clerkId }).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/update-game-stats', async (req, res) => {
  const { playerClerkIds } = req.body;

  if (!playerClerkIds || !Array.isArray(playerClerkIds) || playerClerkIds.length === 0) {
    return res.status(400).json({ message: 'playerClerkIds array is required' });
  }

  try {
    const updatePromises = playerClerkIds.map(async (clerkId) => {
      const user = await User.findOne({ clerkId });
      if (user) {

        user.gameCount += 1;

        const newPlaypals = playerClerkIds.filter((id) => id !== clerkId);
        user.playpals = [...new Set([...user.playpals, ...newPlaypals])];
        await user.save();
      }
    });

    await Promise.all(updatePromises);
    res.status(200).json({ success: true, message: 'Game stats updated' });
  } catch (err) {
    console.error('Error updating game stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
