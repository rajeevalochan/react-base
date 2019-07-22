import React from "react";
import { Redirect } from "@reach/router";
import Authorization from "../../Helpers/Authorization";

/**
 * If we have a logged-in user, redirect to the home page. Otherwise, display the component.
 */
const Routes = ({
  component: Component,
  private: isPrivate,
  path,
  ...rest
}) => {
  const isLoggedIn = Authorization.isLoggedIn();
  try {
    if (isPrivate) {
      return (
        <>
          {isLoggedIn ? (
            <Component path={"/dashboard"} {...rest} />
          ) : (
            <Redirect to={"/"} noThrow {...rest} />
          )}
        </>
      );
    } else {
      return (
        <>
          {isLoggedIn ? (
            <Redirect to={"/dashboard"} />
          ) : (
            <Component path={path} {...rest} />
          )}
        </>
      );
    }
  } catch (error) {
    console.log("Error", error);
  }
};

export default Routes;
