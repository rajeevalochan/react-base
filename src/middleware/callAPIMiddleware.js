import RequestFactory from "../Helpers/RequestFactory";
import _ from "lodash";
import {
  DEFAULT_STATE,
  DEFAULT_STATE_FF_EF,
  DEFAULT_STATE_FF_ET
} from "../Helpers/Constants";

export default function callAPIMiddleware({ dispatch, getState }) {
  /*Handling events with React elements is very similar to handling events on DOM elements
   * Inside a loop it is common to want to pass an extra parameter to an event handler.
   *the e argument representing the React event will be passed as a second argument after the ID.
   *With an arrow function, we have to pass it explicitly,
   *but with bind any further arguments are automatically forwarded
   *The bind() method creates a new function that, when called, has its this keyword set to the provided value
   *An arrow function expression has a shorter syntax than a function expression and does not have its own this, arguments, super, or new.target
   */
  return next => action => {
    const {
      types,
      method = "GET",
      url,
      data = {},
      queryParams,
      service = "digisense",
      requestBodyType = "Json",
      payload = {},
      returnExistObject
    } = action;
    // Check the given 'returnExistObject' exist in state or not
    // If exist and response status is success, then return the same state, do not call the API
    if (returnExistObject) {
      const state = getState();
      const existObject = state[returnExistObject];
      if (
        Object.keys(existObject.response).length > 0 &&
        existObject.response.status === 200 &&
        !_.isUndefined(existObject.response.data) &&
        existObject.response.data.length > 0
      ) {
        // Normal action: pass it on
        action.type = "RETURN_EXIST_OBJECT";
        return next(action);
      }
    }

    if (!types) {
      // Normal action: pass it on
      return next(action);
    }

    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === "string")
    ) {
      throw new Error("Expected an array of three string types.");
    }

    // Check whether given URL is valid or not
    if (!url && typeof url !== "string") {
      throw new Error(
        "URL must not be empty and Expected callAPI to be a string"
      );
    }

    const [requestType, successType, failureType] = types;

    const pending = Object.assign({}, payload, DEFAULT_STATE, {
      method: method
    });

    dispatch({
      type: requestType,
      payload: pending
    });

    // Call the API request
    return RequestFactory.withRequestBodyType(requestBodyType)
      .withService(service)
      .call(
        method,
        url,
        data,
        response => {
          // Success status
          const success = Object.assign(
            {},
            payload,
            DEFAULT_STATE_FF_EF,
            {
              response
            },
            {
              method: method
            }
          );

          dispatch({
            type: successType,
            payload: success
          });
        },
        response => {
          // Error
          const error = Object.assign(
            {},
            payload,
            DEFAULT_STATE_FF_ET,
            {
              response
            },
            {
              method: method
            }
          );
          dispatch({
            type: failureType,
            payload: error
          });
        },
        queryParams
      );
  };
}
