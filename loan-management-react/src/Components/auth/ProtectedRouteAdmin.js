import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthContext from "./auth-context";

export default function ProtectedRouteAdmin({ component: Component, ...rest }) {
  const authCtx = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (authCtx.authData) {
          const { type } = authCtx.authData;
          if (type === "Admin") {
            return <Component {...props} />;
          } else {
            return <Redirect to="/login" />;
          }
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
}
