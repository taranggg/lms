"use client";

import React, { createContext, useReducer } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  role: string;
  // add other fields if present in your token
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  dispatch: React.Dispatch<Action>;
}

export interface Action {
  type: string;
  payload: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface LocalState {
    token: string | null;
    user: User | null;
}

function reducer(state: LocalState, action: Action): LocalState {
  switch (action.type) {
    case "SIGN_IN":
      if (action.payload) {
        localStorage.setItem("accessToken", action.payload);
        try {
            const decoded = jwtDecode<User>(action.payload);
            return { token: action.payload, user: decoded };
        } catch (e) {
            console.error("Invalid token", e);
             return { token: action.payload, user: null };
        }
      }
      return state;
    case "SIGN_OUT":
      localStorage.removeItem("accessToken");
      return { token: null, user: null };
    default:
      return state;
  }
}

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, { token: null, user: null });

  React.useEffect(() => {
    // Check localStorage on client mount to handle hydration correctly.
    // We cannot read localStorage during the initial render because it would cause
    // a mismatch between server-rendered HTML and client-rendered HTML.
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      dispatch({ type: "SIGN_IN", payload: storedToken });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token: state.token, user: state.user, dispatch }}>
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
