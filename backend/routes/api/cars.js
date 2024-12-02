const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Car, CarImage, Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// **Validation Middleware**
const validateCar = [
  check('make').exists({ checkFalsy: true }).withMessage('Make is required.'),
  check('model').exists({ checkFalsy: true }).withMessage('Model is required.'),
  check('year')
    .isInt({ min: 1886 }) // First car invented in 1886
    .withMessage('Year must be a valid integer.'),
  check('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number.'),
  handleValidationErrors
];

// **Create a Car**
router.post('/', requireAuth, validateCar, async (req, res) => {
  const { make, model, year, price } = req.body;

  const newCar = await Car.create({
    ownerId: req.user.id,
    make,
    model,
    year,
    price,
  });

  return res.status(201).json(newCar);
});

// **Get All Cars**
router.get('/', async (_req, res) => {
  const cars = await Car.findAll({
    include: { model: CarImage, attributes: ['url'], limit: 1 }
  });

  const carList = cars.map(car => {
    const carData = car.toJSON();
    carData.previewImage = carData.CarImages?.[0]?.url || null;
    delete carData.CarImages;
    return carData;
  });

  return res.status(200).json({ Cars: carList });
});

// **Get Details of a Car**
router.get('/:carId', async (req, res) => {
  const car = await Car.findByPk(req.params.carId, {
    include: [
      { model: CarImage, attributes: ['id', 'url'] },
      { model: Review }
    ]
  });

  if (!car) {
    return res.status(404).json({ message: "Car couldn't be found" });
  }

  return res.json(car);
});

// **Update a Car**
router.put('/:carId', requireAuth, validateCar, async (req, res) => {
  const { carId } = req.params;
  const { make, model, year, price } = req.body;

  const car = await Car.findByPk(carId);

  if (!car) {
    return res.status(404).json({ message: "Car couldn't be found" });
  }

  if (car.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await car.update({ make, model, year, price });

  return res.json(car);
});

// **Delete a Car**
router.delete('/:carId', requireAuth, async (req, res) => {
  const { carId } = req.params;

  const car = await Car.findByPk(carId);

  if (!car) {
    return res.status(404).json({ message: "Car couldn't be found" });
  }

  if (car.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await car.destroy();

  return res.json({ message: 'Successfully deleted' });
});

module.exports = router;