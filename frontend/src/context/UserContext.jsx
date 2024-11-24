/* eslint-disable react/prop-types */

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { URL } from "../url";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // If user is in localStorage, set it in state
      setUser(JSON.parse(storedUser));
    } else {
      getUser(); // If no user in localStorage, fetch from API
    }
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get(URL + "/api/auth/refetch", { withCredentials: true });
      // Set the user in state
      setUser(res.data);
      // Store the user data in localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
