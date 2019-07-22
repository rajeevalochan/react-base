//React-Core
import React from "react";
import { render } from "react-dom";

//Redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

//Reducers-File
import callAPIMiddleware from "./middleware/callAPIMiddleware";
import reducer from "./reducers";

//Router
import { Router } from "@reach/router";

//Routes-File
import Routes from "./components/Routes";
import { ROUTE } from "./config";

//Not-Found Component
import NotFound from "./components/NotFound";

//CSS
import "./index.css";

//CSS
import * as serviceWorker from "./serviceWorker";

const middleware = [thunkMiddleware, callAPIMiddleware];

if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger());
}

//Route generating functionality
const setRoutes = () => {
  return ROUTE.map((route, index) => (
    <Routes
      private={route.private}
      key={index}
      path={route.path}
      meta={route.meta}
      exact={route.exact}
      component={route.component}
    />
  ));
};
render(
  <Provider store={createStore(reducer, applyMiddleware(...middleware))}>
    <Router basepath={process.env.PUBLIC_URL}>
      {setRoutes()}
      <NotFound default />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
