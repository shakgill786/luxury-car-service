import { csrfFetch } from './csrf';

const LOAD_BOOKINGS = 'bookings/LOAD';
const ADD_BOOKING = 'bookings/ADD';
const REMOVE_BOOKING = 'bookings/REMOVE';

// Action Creators
const loadBookings = (bookings) => ({ type: LOAD_BOOKINGS, bookings });
const addBooking = (booking) => ({ type: ADD_BOOKING, booking });
const removeBooking = (bookingId) => ({ type: REMOVE_BOOKING, bookingId });

// Thunks
export const fetchBookings = () => async (dispatch) => {
  const response = await csrfFetch('/api/bookings/current');
  if (response.ok) {
    const bookings = await response.json();
    dispatch(loadBookings(bookings.Bookings));
  }
};

export const createBooking = (bookingData) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings`, {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
  if (response.ok) {
    const booking = await response.json();
    dispatch(addBooking(booking));
  }
};

export const deleteBooking = (bookingId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    dispatch(removeBooking(bookingId));
  }
};

// Reducer
const bookingsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_BOOKINGS:
      return { ...state, ...Object.fromEntries(action.bookings.map((b) => [b.id, b])) };
    case ADD_BOOKING:
      return { ...state, [action.booking.id]: action.booking };
    case REMOVE_BOOKING:
      const newState = { ...state };
      delete newState[action.bookingId];
      return newState;
    default:
      return state;
  }
};

export default bookingsReducer;