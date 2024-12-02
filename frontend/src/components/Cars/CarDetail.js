import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CarDetail = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCarDetail = async () => {
      const response = await fetch(`/api/cars/${carId}`);
      if (response.ok) {
        const carData = await response.json();
        setCar(carData);
      }
    };

    fetchCarDetail();
  }, [carId]);

  if (!car) return <p>Loading car details...</p>;

  return (
    <div className="car-detail">
      <h1>{car.make} {car.model} ({car.year})</h1>
      <p>Price: ${car.price.toFixed(2)}</p>
      <h3>Images:</h3>
      <div className="car-images">
        {car.CarImages.map((image) => (
          <img key={image.id} src={image.url} alt={`${car.make} ${car.model}`} />
        ))}
      </div>
      <h3>Reviews:</h3>
      {car.Reviews.map((review) => (
        <div key={review.id} className="review">
          <p>{review.review}</p>
          <p>Stars: {review.stars}</p>
        </div>
      ))}
    </div>
  );
};

export default CarDetail;