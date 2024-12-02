import { csrfFetch } from "../utils/csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

export const setUser = (user) => ({ type: SET_USER, payload: user });
export const removeUser = () => ({ type: REMOVE_USER });

export const login = (credentials) => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
};

export const logout = () => async (dispatch) => {
  await csrfFetch("/api/session", { method: "DELETE" });
  dispatch(removeUser());
};

const initialState = { user: null };

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}