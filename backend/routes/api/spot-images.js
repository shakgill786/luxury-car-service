const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot } = require('../../db/models');

const router = express.Router();

/**
 * DELETE /api/spot-images/:imageId
 * Delete a Spot Image
 * - Requires authentication and authorization.
 */
router.delete('/:imageId', requireAuth, async (req, res) => {
  try {
    const { imageId } = req.params;

    // Find the SpotImage by ID, including the associated Spot for ownership validation
    const spotImage = await SpotImage.findByPk(imageId, {
      include: {
        model: Spot,
        attributes: ['ownerId'], // Only need the owner's ID for authorization
      },
    });

    // Check if the SpotImage exists
    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    // Check if the current user is the owner of the spot
    if (spotImage.Spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Delete the image
    await spotImage.destroy();

    // Send success response
    return res.status(200).json({ message: 'Successfully deleted' });

  } catch (error) {
    console.error('Error deleting spot image:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
