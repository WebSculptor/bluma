"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/config/firbase";

export const useUser = () => {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => setUser(user));
  }, []);

  return user;
};
