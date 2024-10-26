const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot, ReviewImage, Review } = require('../../db/models');

const router = express.Router();

/**
 * Helper function to find and delete an image with appropriate ownership checks.
 */
const findAndDeleteImage = async (model, imageId, ownerKey, req, res) => {
  try {
    const image = await model.findByPk(imageId, {
      include: {
        model: ownerKey === 'ownerId' ? Spot : Review,
        attributes: [ownerKey],
      },
    });

    if (!image) {
      return res.status(404).json({ message: `${model.name} couldn't be found` });
    }

    const ownerId = image[ownerKey === 'ownerId' ? 'Spot' : 'Review'][ownerKey];
    if (ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await image.destroy();
    return res.status(200).json({ message: 'Successfully deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add an Image to a Spot
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  // Validate the input
  if (!url) {
    return res.status(400).json({
      message: 'Bad Request',
      errors: { url: 'Image URL is required' },
    });
  }

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const newImage = await SpotImage.create({ spotId, url, preview });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a Spot Image
router.delete('/spot-images/:imageId', requireAuth, async (req, res) => {
  await findAndDeleteImage(SpotImage, req.params.imageId, 'ownerId', req, res);
});

// Delete a Review Image
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
  await findAndDeleteImage(ReviewImage, req.params.imageId, 'userId', req, res);
});

module.exports = router;
