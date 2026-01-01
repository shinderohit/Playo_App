
const express = require('express');
const router = express.Router();
const Venue = require('../models/venue');

router.post('/add', async (req, res) => {
  try {
    const venues = req.body;
    if (!Array.isArray(venues)) {
      return res.status(400).json({ error: 'Expected an array of venues' });
    }

    const savedVenues = [];
    const skippedVenues = [];

    for (const venueData of venues) {
      const existingVenue = await Venue.findOne({ name: venueData.name });
      if (existingVenue) {
        skippedVenues.push(venueData.name);
      } else {
        const newVenue = new Venue(venueData);
        await newVenue.save();
        savedVenues.push(venueData.name);
      }
    }

    res.status(201).json({
      message: 'Venues processed successfully',
      saved: savedVenues,
      skipped: skippedVenues,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error adding venues', details: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching venues', details: err.message });
  }
});


router.get('/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.status(200).json(venue);
  } catch (err) {
    console.error('Error fetching venue:', err);
    res.status(500).json({ message: 'Failed to fetch venue', error: err.message });
  }
});

module.exports = router;