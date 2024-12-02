import React from 'react';
import { useParams } from 'react-router-dom';

const SpotDetailPage = () => {
  const { spotId } = useParams();

  return (
    <div>
      <h1>Spot Detail Page</h1>
      <p>Details for Spot ID: {spotId}</p>
    </div>
  );
};

export default SpotDetailPage;