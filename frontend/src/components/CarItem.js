// src/components/CarItem.js
import React from 'react';
import './CarItem.css';

const CarItem = ({ car }) => {
    return (
        <div className="car-item">
            <img src={car.image} alt={car.model} />
            <h3>{car.model}</h3>
            <p>{car.price} / day</p>
            <button>View Details</button>
        </div>
    );
};

export default CarItem;
