const express = require('express');
const { Op } = require('sequelize'); // Make sure Op is imported
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// **Validation middleware for creating/updating bookings**
const validateBooking = [
  check('startDate').isISO8601().withMessage('Start date is required'),
  check('endDate').isISO8601().withMessage('End date is required'),
  handleValidationErrors
];

// **Get all bookings of the current user**
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;

  const bookings = await Booking.findAll({
    where: { userId: user.id },
    include: [
      {
        model: Spot,
        include: [
          {
            model: SpotImage,
            where: { preview: true },
            required: false,
            attributes: ['url']
          }
        ],
        attributes: ['id', 'name', 'address', 'city', 'state', 'country', 'price']
      }
    ]
  });

  const formattedBookings = bookings.map(booking => ({
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
      previewImage: booking.Spot.SpotImages?.[0]?.url || null
    }
  }));

  return res.json({ Bookings: formattedBookings });
});

// **Get all bookings for a spot (owner or public view)**
router.get('/spots/:spotId/bookings', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { user } = req;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const bookings = await Booking.findAll({
    where: { spotId },
    attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate']
  });

  if (spot.ownerId === user.id) {
    return res.json({ Bookings: bookings });
  }

  const restrictedBookings = bookings.map(booking => ({
    startDate: booking.startDate,
    endDate: booking.endDate
  }));

  return res.json({ Bookings: restrictedBookings });
});

// **Create a booking**
router.post('/spots/:spotId/bookings', requireAuth, validateBooking, async (req, res) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const { user } = req;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId === user.id) {
    return res.status(403).json({ message: "You cannot book your own spot" });
  }

  const existingBooking = await Booking.findOne({
    where: {
      spotId,
      startDate: { [Op.lte]: endDate },
      endDate: { [Op.gte]: startDate }
    }
  });

  if (existingBooking) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking'
      }
    });
  }

  const newBooking = await Booking.create({
    spotId,
    userId: user.id,
    startDate,
    endDate
  });

  return res.status(201).json(newBooking);
});

// **Update a booking**
router.put('/bookings/:bookingId', requireAuth, validateBooking, async (req, res) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;
  const { user } = req;

  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (booking.userId !== user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const conflictingBooking = await Booking.findOne({
    where: {
      spotId: booking.spotId,
      startDate: { [Op.lte]: endDate },
      endDate: { [Op.gte]: startDate },
      id: { [Op.ne]: bookingId }
    }
  });

  if (conflictingBooking) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking'
      }
    });
  }

  await booking.update({ startDate, endDate });
  return res.json(booking);
});

// **Delete a booking**
router.delete('/bookings/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const { user } = req;

  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (booking.userId !== user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await booking.destroy();
  return res.json({ message: 'Successfully deleted' });
});

module.exports = router;
