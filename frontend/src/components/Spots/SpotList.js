import React, { useEffect, useState } from 'react';
import { getAllSpots } from '../../services/api';

const SpotList = () => {
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        async function fetchSpots() {
            try {
                const data = await getAllSpots();
                setSpots(data);
            } catch (error) {
                console.error('Error fetching spots', error);
            }
        }
        fetchSpots();
    }, []);

    return (
        <div>
            <h1>Spots</h1>
            <ul>
                {spots.map((spot) => (
                    <li key={spot.id}>{spot.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SpotList;
