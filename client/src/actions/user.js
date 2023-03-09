import api from "../utils/api";
import { setAlert } from "./alert";
import {
  LOGOUT,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  WITHDRAW_SUCESS,
  REGISTER_FAIL,
} from "./types";

// Logout
export const logout = () => ({ type: LOGOUT });

export const signUp = (walletAddress, userName) => async (dispatch) => {
  try {
    const res = await api.post("/users/signup", {
      name: userName,
      wallet: walletAddress,
    });
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    console.log("errros----", err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get("/users");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Login User
export const logIn = (walletAddress) => async (dispatch) => {
  try {
    const res = await api.post("/users/login", { wallet: walletAddress });
    console.log("login", res);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//buy tank

export const addTank = (amount) => async (dispatch) => {
  try {
    const res = await api.post("/users/addTank", { tank: amount });
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
export const removeTank = () => async (dispatch) => {
  try {
    const res = await api.post("/users/removeTank");
    // dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
export const addScore = (score) => async (dispatch) => {
  try {
    console.log("score:", score);
    const res = await api.post("/users/addScore", { score: score });
    dispatch(loadUser());
    dispatch(setAlert("Addscore Success!", "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
  }
}
export const withDraw = () => async (dispatch) => {
  try {
    const res = await api.post("/users/withdraw");
    console.log("withDraw", res);
    dispatch(loadUser());
    dispatch(setAlert("WithDraw Success!", "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
  }
};
