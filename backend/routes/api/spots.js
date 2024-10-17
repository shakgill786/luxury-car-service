const express = require('express');
const { Op } = require('sequelize');
const { Spot, SpotImage, Review, ReviewImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Spot validation middleware
const validateSpot = [
  check('address').exists({ checkFalsy: true }).withMessage('Street address is required'),
  check('city').exists({ checkFalsy: true }).withMessage('City is required'),
  check('state').exists({ checkFalsy: true }).withMessage('State is required'),
  check('country').exists({ checkFalsy: true }).withMessage('Country is required'),
  check('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  check('lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  check('name').isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
  check('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  handleValidationErrors,
];

// Validation middleware for reviews
const validateReview = [
  check('review').exists({ checkFalsy: true }).withMessage('Review text is required'),
  check('stars').isInt({ min: 1, max: 5 }).withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];

// -------------------- Spot Routes --------------------

// Get all spots with optional query filters
router.get('/', async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  page = parseInt(page) || 1;
  size = parseInt(size) || 20;
  size = Math.min(size, 20);

  const where = {};
  if (minLat) where.lat = { [Op.gte]: minLat };
  if (maxLat) where.lat = { [Op.lte]: maxLat };
  if (minLng) where.lng = { [Op.gte]: minLng };
  if (maxLng) where.lng = { [Op.lte]: maxLng };
  if (minPrice) where.price = { [Op.gte]: minPrice };
  if (maxPrice) where.price = { [Op.lte]: maxPrice };

  const spots = await Spot.findAll({
    where,
    limit: size,
    offset: (page - 1) * size,
    include: [{ model: SpotImage, attributes: ['url'], where: { preview: true }, required: false }],
  });

  const formattedSpots = spots.map(spot => ({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    previewImage: spot.SpotImages?.[0]?.url || null,
  }));

  res.json({ Spots: formattedSpots, page, size });
});

// Get all spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;

  const spots = await Spot.findAll({
    where: { ownerId: user.id },
    include: [{ model: SpotImage, attributes: ['url'], where: { preview: true }, required: false }],
  });

  const formattedSpots = spots.map(spot => ({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    previewImage: (spot.SpotImages && spot.SpotImages[0]) ? spot.SpotImages[0].url : null,
  }));

  res.json({ Spots: formattedSpots });
});

// Get details of a spot by ID
router.get('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      { model: SpotImage, attributes: ['id', 'url', 'preview'] },
      { model: Review, attributes: [] },
    ],
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const formattedSpot = {
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    SpotImages: spot.SpotImages,
  };

  res.json(formattedSpot);
});

// Create a new spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  try {
    const spot = await Spot.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    res.status(201).json(spot);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: err.errors.map(e => e.message),
      });
    }
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  await spot.update({ address, city, state, country, lat, lng, name, description, price });

  res.json(spot);
});

// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await spot.destroy();
  res.json({ message: 'Successfully deleted' });
});

// Add an image to a spot
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { url, preview } = req.body;
  const newImage = await SpotImage.create({ spotId: spot.id, url, preview });

  res.status(201).json(newImage);
});

// -------------------- Review Routes for Spots --------------------

// Get reviews for a specific spot
router.get('/:spotId/reviews', async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const reviews = await Review.findAll({
    where: { spotId },
    include: [
      { model: User, attributes: ['id', 'username'] },
      { model: ReviewImage, attributes: ['id', 'url'] },
    ],
  });

  return res.json({ Reviews: reviews });
});

// Create a review for a spot
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
  const { user } = req;
  const { spotId } = req.params;
  const { review, stars } = req.body;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const existingReview = await Review.findOne({
    where: { userId: user.id, spotId },
  });

  if (existingReview) {
    return res.status(400).json({ message: "User already has a review for this spot" });
  }

  const newReview = await Review.create({
    userId: user.id,
    spotId,
    review,
    stars,
  });

  res.status(201).json(newReview);
});

module.exports = router;
