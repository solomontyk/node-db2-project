const express = require("express");
const Cars = require("./cars-model");
const {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
} = require("./cars-middleware");


const router = express.Router();


router.get("/", async (req, res, next) => {
  try {
    const cars = await Cars.getAll();
    res.json(cars);
  } catch (err) {
    next(err);
  }
});


router.get("/:id", checkCarId, (req, res, next) => {
  try {
    res.json(req.car);
  } catch (err) {
    next(err);
  }
});


router.post(
  "/",
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
  async (req, res, next) => {
    try {
      const { vin, make, model, mileage, title, transmission } = req.body;
      const newCar = {
        vin,
        make,
        model,
        mileage,
        title,
        transmission,
      };
      const createdCar = await Cars.create(newCar);
      res.status(201).json(createdCar);
    } catch (err) {
      next(err);
    }
  }
);


// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});


module.exports = router;

