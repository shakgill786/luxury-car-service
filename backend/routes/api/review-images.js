const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot, ReviewImage, Review } = require('../../db/models');

const router = express.Router();

/**
 * Helper Function to Find and Delete Images
 * Handles deletion for both SpotImage and ReviewImage models.
 */
const findAndDeleteImage = async (model, imageId, ownerKey, req, res) => {
    try {
      const image = await model.findByPk(imageId, {
        include: { 
          model: ownerKey === 'ownerId' ? Spot : Review, 
          attributes: [ownerKey] 
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
      return res.json({ message: 'Successfully deleted' });
      
    } catch (error) {
      console.error('Image Deletion Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  /**
   * Delete a Review Image
   * Requires authentication and review ownership verification.
   */
  router.delete('/:imageId', requireAuth, async (req, res) => {
    await findAndDeleteImage(ReviewImage, req.params.imageId, 'userId', req, res);
  });
  
  module.exports = router;