import { csrfFetch } from './csrf';

/* Action Types */
const LOAD_CARS = 'cars/load';
const ADD_CAR = 'cars/add';
const UPDATE_CAR = 'cars/update';
const DELETE_CAR = 'cars/delete';

/* Action Creators */
const loadCars = (cars) => ({ type: LOAD_CARS, cars });
const addCar = (car) => ({ type: ADD_CAR, car });
const updateCar = (car) => ({ type: UPDATE_CAR, car });
const deleteCar = (carId) => ({ type: DELETE_CAR, carId });

/* Thunks */
export const fetchCars = () => async (dispatch) => {
  const response = await csrfFetch('/api/cars');
  if (response.ok) {
    const { Cars } = await response.json();
    dispatch(loadCars(Cars));
  }
};

export const createCar = (carData) => async (dispatch) => {
  const response = await csrfFetch('/api/cars', {
    method: 'POST',
    body: JSON.stringify(carData),
  });

  if (response.ok) {
    const car = await response.json();
    dispatch(addCar(car));
  }
};

export const updateCarThunk = (carId, carData) => async (dispatch) => {
  const response = await csrfFetch(`/api/cars/${carId}`, {
    method: 'PUT',
    body: JSON.stringify(carData),
  });

  if (response.ok) {
    const car = await response.json();
    dispatch(updateCar(car));
  }
};

export const deleteCarThunk = (carId) => async (dispatch) => {
  const response = await csrfFetch(`/api/cars/${carId}`, { method: 'DELETE' });

  if (response.ok) {
    dispatch(deleteCar(carId));
  }
};

/* Reducer */
const carsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_CARS:
      return { ...action.cars.reduce((acc, car) => ({ ...acc, [car.id]: car }), {}) };
    case ADD_CAR:
      return { ...state, [action.car.id]: action.car };
    case UPDATE_CAR:
      return { ...state, [action.car.id]: action.car };
    case DELETE_CAR:
      const newState = { ...state };
      delete newState[action.carId];
      return newState;
    default:
      return state;
  }
};

export default carsReducer;