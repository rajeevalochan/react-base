export const PENDING = "PENDING";
export const FULFILLED = "FULFILLED";
export const REJECTED = "REJECTED";

// Default state
export const DEFAULT_STATE = {
  isFetching: true,
  isError: false,
  response: {}
};

// default state for Fetching false & Error False
export const DEFAULT_STATE_FF_EF = {
  isFetching: false,
  isError: false,
  response: {}
};

// default state for Fetching false & Error true
export const DEFAULT_STATE_FF_ET = {
  isFetching: false,
  isError: true,
  response: {}
};