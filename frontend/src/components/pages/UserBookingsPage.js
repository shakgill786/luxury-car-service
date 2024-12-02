import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../../store/bookings';

const UserBookingsPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  return (
    <div>
      <h1>Your Bookings</h1>
      {Object.values(bookings).map((booking) => (
        <div key={booking.id}>
          <h2>{booking.Spot.name}</h2>
          <p>{booking.startDate} to {booking.endDate}</p>
        </div>
      ))}
    </div>
  );
};

export default UserBookingsPage;