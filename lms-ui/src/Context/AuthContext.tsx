"use client";

import React, { createContext, useReducer } from "react";

let token = "";

if (typeof window != "undefined") {
  token = localStorage.getItem("accessToken") || "";
}

export interface AuthContextType {
  token: string | null;
  dispatch: React.Dispatch<Action>;
}

export interface Action {
  type: string;
  payload: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

function reducer(state: string | null, action: Action) {
  console.log(action);

  switch (action.type) {
    case "SIGN_IN":
      localStorage.setItem("accessToken", action.payload || "");
      return action.payload;
    case "SIGN_OUT":
      localStorage.removeItem("accessToken");
      return null;
    default:
      return state;
  }
}

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, token);

  return (
    <AuthContext.Provider value={{ token: state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
