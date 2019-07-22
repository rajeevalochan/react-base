import { combineReducers } from "redux";
import {
  DEFAULT_STATE,
  PENDING,
  FULFILLED,
  REJECTED,
  DEFAULT_STATE_FF_EF
} from "../Helpers/Constants";
// import { filtersForLiveTracking } from "../containers/MapOverlays/Filters/Reducer";

/**
 * Common funtion to create the reducer
 * @param {*} reducerName name of operation
 * @param {*} defaultStateParam default states
 */
const createReducer = (reducerName, defaultStateParam) => {
  return (state, action) => {
    state = state || defaultStateParam || DEFAULT_STATE;
    switch (action.type) {
      case `${reducerName}_${PENDING}`:
      case `${reducerName}_${FULFILLED}`:
      case `${reducerName}_${REJECTED}`:
        return Object.assign({}, action.payload);
      default:
        return state;
    }
  };
};

const rootReducer = combineReducers({
  login: createReducer("LOGIN", DEFAULT_STATE_FF_EF)
});

export default rootReducer;
