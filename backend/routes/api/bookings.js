const express = require('express');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Booking Validation Middleware
const validateBooking = [
  check('startDate').isISO8601().withMessage('Start date is required and must be in ISO 8601 format'),
  check('endDate').isISO8601().withMessage('End date is required and must be in ISO 8601 format'),
  handleValidationErrors,
];

// GET /api/bookings/current - Get all bookings of the current user
router.get('/current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: Spot,
        include: [
          {
            model: SpotImage,
            where: { preview: true },
            required: false,
            attributes: ['url'],
          },
        ],
        attributes: ['id', 'name', 'address', 'city', 'state', 'country', 'price'],
      },
    ],
  });

  const formattedBookings = bookings.map((booking) => ({
    id: booking.id,
    spotId: booking.spotId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    Spot: {
      id: booking.Spot.id,
      name: booking.Spot.name,
      address: booking.Spot.address,
      city: booking.Spot.city,
      state: booking.Spot.state,
      country: booking.Spot.country,
      price: booking.Spot.price,
      previewImage: booking.Spot.SpotImages?.[0]?.url || null,
    },
  }));

  return res.json({ Bookings: formattedBookings });
});

// POST /api/spots/:spotId/bookings - Create a booking
router.post('/spots/:spotId/bookings', requireAuth, validateBooking, async (req, res) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;

  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({
      message: 'Bad Request',
      errors: { endDate: 'End date must be after the start date' },
    });
  }

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId === req.user.id) {
    return res.status(403).json({ message: 'You cannot book your own spot' });
  }

  const conflictingBooking = await Booking.findOne({
    where: {
      spotId,
      [Op.or]: [
        {
          startDate: { [Op.between]: [startDate, endDate] },
        },
        {
          endDate: { [Op.between]: [startDate, endDate] },
        },
      ],
    },
  });

  if (conflictingBooking) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking',
      },
    });
  }

  const newBooking = await Booking.create({
    spotId,
    userId: req.user.id,
    startDate,
    endDate,
  });

  return res.status(201).json(newBooking);
});

// DELETE /api/bookings/:bookingId - Delete a booking
router.delete('/bookings/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (booking.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (new Date(booking.startDate) <= new Date()) {
    return res.status(403).json({
      message: "Bookings that have started can't be deleted",
    });
  }

  await booking.destroy();
  return res.status(200).json({ message: 'Successfully deleted' });
});

module.exports = router;
