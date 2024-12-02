import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import carsReducer from "./cars";
import reviewsReducer from "./reviews";
import bookingsReducer from "./bookings";

const rootReducer = combineReducers({
  session: sessionReducer,
  cars: carsReducer,
  reviews: reviewsReducer,
  bookings: bookingsReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;