const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot, ReviewImage, Review } = require('../../db/models'); // Consolidated imports
const router = express.Router();

// **Delete a spot image**
router.delete('/spot-images/:imageId', requireAuth, async (req, res) => {
  try {
    const { imageId } = req.params;
    const { user } = req;

    const spotImage = await SpotImage.findByPk(imageId, {
      include: { model: Spot, attributes: ['ownerId'] },
    });

    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    if (spotImage.Spot.ownerId !== user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await spotImage.destroy();
    return res.json({ message: 'Successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// **Delete a review image**
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
  try {
    const { imageId } = req.params;
    const { user } = req;

    const reviewImage = await ReviewImage.findByPk(imageId, {
      include: { model: Review, attributes: ['userId'] },
    });

    if (!reviewImage) {
      return res.status(404).json({ message: "Review Image couldn't be found" });
    }

    if (reviewImage.Review.userId !== user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await reviewImage.destroy();
    return res.json({ message: 'Successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
