import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCars } from '../../store/cars';

const CarList = () => {
  const dispatch = useDispatch();
  const cars = useSelector((state) => Object.values(state.cars));

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  if (!cars.length) return <p>Loading cars...</p>;

  return (
    <div className="car-list">
      {cars.map((car) => (
        <div key={car.id} className="car-card">
          <h2>{car.make} {car.model} ({car.year})</h2>
          <p>Price: ${car.price.toFixed(2)}</p>
          <img src={car.previewImage || '/placeholder.png'} alt={`${car.make} ${car.model}`} />
        </div>
      ))}
    </div>
  );
};

export default CarList;