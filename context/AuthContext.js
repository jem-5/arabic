"use client";
import React from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isPaidMember, setIsPaidMember] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const fetchPaidStatus = async () => {
      if (user?.uid) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDoc);
          if (isMounted) {
            setIsPaidMember(userSnap.data()?.isPaidMember === true);
          }
        } catch (err) {
          if (isMounted) setIsPaidMember(false);
        }
      } else {
        if (isMounted) setIsPaidMember(false);
      }
    };
    fetchPaidStatus();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Refetch Firestore user data (for manual refresh)
  const refetchUser = async (uid) => {
    if (!uid) return;
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser((prev) => ({ ...prev, ...userDoc.data() }));
        setIsPaidMember(userDoc.data()?.isPaidMember === true);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isPaidMember, refetchUser }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
