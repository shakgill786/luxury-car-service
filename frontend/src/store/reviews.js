import { csrfFetch } from './csrf';

const LOAD_REVIEWS = 'reviews/LOAD';
const ADD_REVIEW = 'reviews/ADD';
const REMOVE_REVIEW = 'reviews/REMOVE';

// Action Creators
const loadReviews = (reviews) => ({ type: LOAD_REVIEWS, reviews });
const addReview = (review) => ({ type: ADD_REVIEW, review });
const removeReview = (reviewId) => ({ type: REMOVE_REVIEW, reviewId });

// Thunks
export const fetchReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadReviews(reviews.Reviews));
  }
};

export const createReview = (spotId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
  if (response.ok) {
    const review = await response.json();
    dispatch(addReview(review));
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    dispatch(removeReview(reviewId));
  }
};

// Reducer
const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_REVIEWS:
      return { ...state, ...Object.fromEntries(action.reviews.map((r) => [r.id, r])) };
    case ADD_REVIEW:
      return { ...state, [action.review.id]: action.review };
    case REMOVE_REVIEW:
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer;