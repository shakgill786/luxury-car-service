import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import Navigation from './components/Navigation';
import HomePage from './components/pages/HomePage';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import CarList from './components/Cars/CarList';
import CarDetail from './components/Cars/CarDetail';
import UserBookingsPage from './components/pages/UserBookingsPage';
import SpotDetailPage from './components/pages/SpotDetailPage';
import NotFoundPage from './components/pages/NotFoundPage';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navigation />
        <Switch>
          {/* Home Page */}
          <Route exact path="/" component={HomePage} />

          {/* Auth Routes */}
          <Route path="/login" component={LoginForm} />
          <Route path="/signup" component={SignupForm} />

          {/* Cars Routes */}
          <Route exact path="/cars" component={CarList} />
          <Route path="/cars/:carId" component={CarDetail} />

          {/* Spots (Luxury Parking Spots) Routes */}
          <Route path="/spots/:spotId" component={SpotDetailPage} />

          {/* User Bookings */}
          <Route path="/bookings" component={UserBookingsPage} />

          {/* 404 Not Found Page */}
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;