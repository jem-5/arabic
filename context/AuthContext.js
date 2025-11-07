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
  const [userProfile, setUserProfile] = React.useState(null);

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

  // Fetch and/or refetch the Firestore user profile document
  const refetchUser = React.useCallback(async (uid) => {
    if (!uid) return null;
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      const fetched = userDoc.exists() ? userDoc.data() || {} : null;
      // Update paid flag and profile state only when it meaningfully changes
      if (fetched) setIsPaidMember(fetched?.isPaidMember === true);
      setUserProfile((prev) => {
        try {
          const prevJson = JSON.stringify(prev || {});
          const fetchedJson = JSON.stringify(fetched || {});
          if (prevJson === fetchedJson) return prev;
          return fetched;
        } catch (e) {
          return fetched;
        }
      });
      return fetched;
    } catch (err) {
      return null;
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Fetch the Firestore profile for this user once on sign-in
        refetchUser(user.uid).catch(() => {});
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [refetchUser]);

  return (
    <AuthContext.Provider
      value={{ user, isPaidMember, userProfile, refetchUser }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
