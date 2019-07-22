import { PENDING, FULFILLED, REJECTED } from "../Helpers/Constants";
import Authorization from "../Helpers/Authorization";
import RequestFactory from "../Helpers/RequestFactory";

/**
 * Login async action creators
 * Hanlde the Pending, Fullfilled (Success), Rejected action
 *
 * @return object
 */
export function login(data) {
  return {
    types: [`LOGIN_${PENDING}`, `LOGIN_${FULFILLED}`, `LOGIN_${REJECTED}`],
    method: "POST",
    url: "login",
    payload: {},
    data
  };
}

/**
 * Forgot password async action creators
 * Hanlde the Pending, Fullfilled (Success), Rejected action
 *
 * @return object
 */
export function forgotpassword(data) {
  return {
    types: [
      `FORGOT_PASSWORD_${PENDING}`,
      `FORGOT_PASSWORD_${FULFILLED}`,
      `FORGOT_PASSWORD_${REJECTED}`
    ],
    method: "POST",
    url: "forgotpassword",
    data: data,
    payload: {}
  };
}

/**
 * Reset password async action creators
 * Hanlde the Pending, Fullfilled (Success), Rejected action
 *
 * @return object
 */
export function resetpassword(data) {
  return {
    types: [
      `RESET_PASSWORD_${PENDING}`,
      `RESET_PASSWORD_${FULFILLED}`,
      `RESET_PASSWORD_${REJECTED}`
    ],
    method: "POST",
    url: "updatepassword",
    payload: {},
    data
  };
}

/**
 * Change password async action creators
 * Hanlde the Pending, Fullfilled (Success), Rejected action
 *
 * @return object
 */
export function changePassword(data) {
  return {
    types: [
      `CHANGE_PASSWORD_${PENDING}`,
      `CHANGE_PASSWORD_${FULFILLED}`,
      `CHANGE_PASSWORD_${REJECTED}`
    ],
    method: "POST",
    url: "changepassword",
    data
  };
}

/**
 * Perform logout operation
 *
 * @return object
 */
export function logout() {
  RequestFactory.withService("digisense")
    .withRequestBodyType("Raw")
    .post(
      `logout`,
      {},
      response => {
        // Display the logout success here
      },
      response => {
        // Display the logout failure here
      }
    );
}
