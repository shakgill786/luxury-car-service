// src/components/CarList.js
import React from 'react';
import CarItem from './CarItem';
import './CarList.css';

const CarList = ({ cars }) => {
    return (
        <div className="car-list">
            {cars.map((car) => (
                <CarItem key={car.id} car={car} />
            ))}
        </div>
    );
};

export default CarList;
