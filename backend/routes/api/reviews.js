const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validation for adding a new review
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];

// Add an Image to a Review by its ID
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;

  // Check if the review exists
  const review = await Review.findByPk(reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  // Check if the review belongs to the current user
  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Check the number of images for the review
  const imageCount = await ReviewImage.count({ where: { reviewId } });
  if (imageCount >= 10) {
    return res.status(403).json({
      message: 'Maximum number of images for this resource was reached',
    });
  }

  // Create a new image for the review
  const newImage = await ReviewImage.create({ reviewId, url });

  // Return the created image with status 201
  return res.status(201).json({
    id: newImage.id,
    url: newImage.url,
  });
});

module.exports = router;
