import React from 'react';
import SpotList from '../components/Spots/SpotList';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

const HomePage = () => (
    <div>
        <h1>Welcome to Luxury Car Services</h1>
        <SpotList />
        <Login />
        <Signup />
    </div>
);

export default HomePage;
