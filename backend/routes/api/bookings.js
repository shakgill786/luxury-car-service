const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Get all bookings of the current user
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;

  const bookings = await Booking.findAll({
    where: { userId: user.id },
    include: [
      {
        model: Spot,
        include: [SpotImage]
      }
    ]
  });

  return res.json({ Bookings: bookings });
});

// Get all bookings for a spot
router.get('/spots/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { user } = req;
  
    const bookings = await Booking.findAll({
      where: { spotId },
      attributes: ['id', 'spotId', 'startDate', 'endDate', 'userId']
    });
  
    if (!bookings.length) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
  
    // If the current user owns the spot, include user details in the response
    if (bookings[0].userId === user.id) {
      return res.json({ Bookings: bookings });
    }
  
    // If the user does not own the spot, restrict the response
    const restrictedBookings = bookings.map(booking => ({
      spotId: booking.spotId,
      startDate: booking.startDate,
      endDate: booking.endDate
    }));
  
    return res.json({ Bookings: restrictedBookings });
  });

  // Validation middleware for creating bookings
const validateBooking = [
    check('startDate').isISO8601().withMessage('Start date is required'),
    check('endDate').isISO8601().withMessage('End date is required'),
    handleValidationErrors
  ];
  
  // Create a booking
  router.post(
    '/spots/:spotId/bookings',
    requireAuth,
    validateBooking,
    async (req, res) => {
      const { spotId } = req.params;
      const { startDate, endDate } = req.body;
      const { user } = req;
  
      const existingBooking = await Booking.findOne({
        where: {
          spotId,
          startDate: { [Op.lte]: endDate },
          endDate: { [Op.gte]: startDate }
        }
      });
  
      if (existingBooking) {
        return res.status(403).json({
          message: 'Booking conflict',
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
    }
  );

  // Update a booking
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
        message: 'Booking conflict',
        errors: {
          startDate: 'Start date conflicts with an existing booking',
          endDate: 'End date conflicts with an existing booking'
        }
      });
    }
  
    await booking.update({ startDate, endDate });
  
    return res.json(booking);
  });

  
  // Delete a booking
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
