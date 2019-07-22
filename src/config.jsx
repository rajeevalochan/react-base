import React, { Suspense, useState } from "react";

import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

// site title
export const siteTitle = "Daimler Trucks";
export const siteMetaDescription = "Daimler Trucks";

export const setTitle = title => {
  document.title = title ? title : siteTitle;
};

export const setMetaDescription = description => {
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", description ? description : siteMetaDescription);
};

export const ROUTE = [
  {
    private: false,
    path: "/",
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: loadable(props => pMinDelay(import(`./components/Login`)), {
      cacheKey: props => props.page,
      fallback: <div>Loading...</div>
    })
  },
  {
    private: false,
    path: "/dashboard",
    meta: {
      title: siteTitle,
      description: siteMetaDescription
    },
    component: loadable(props => pMinDelay(import(`./components/Dashboard`)), {
      cacheKey: props => props.page,
      fallback: <div>Loading...</div>
    })
  }
];
