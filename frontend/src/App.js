import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Import your components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import SpotsList from './components/SpotsList';
import SpotDetails from './components/SpotDetails';
import CreateSpot from './components/CreateSpot';
import UserSpots from './components/UserSpots';
import EditSpot from './components/EditSpot';
import Reviews from './components/Reviews';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  // Show a loading state until authentication check is complete
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {/* Adding Navbar */}
      <Navbar />
      
      {/* Main content area */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected Routes */}
          <Route 
            path="/spots" 
            element={user ? <SpotsList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/spots/new" 
            element={user ? <CreateSpot /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/spots/:spotId" 
            element={<SpotDetails />} 
          />
          <Route 
            path="/my-spots" 
            element={user ? <UserSpots /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/spots/:spotId/edit" 
            element={user ? <EditSpot /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/spots/:spotId/reviews" 
            element={<Reviews />} 
          />
        </Routes>
      </main>

      {/* Adding Footer */}
      <Footer />
    </div>
  );
}

export default App;
