// src/components/CarDetails.js
import React from 'react';
import './CarDetails.css';

const CarDetails = ({ car }) => {
    return (
        <div className="car-details">
            <img src={car.image} alt={car.model} />
            <h2>{car.model}</h2>
            <p>Price: {car.price} / day</p>
            <p>Location: {car.location}</p>
            <button>Book Now</button>
        </div>
    );
};

export default CarDetails;
