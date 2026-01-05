"use client";
import React from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isPaidMember, setIsPaidMember] = React.useState(false);
  const [boughtPracticePack, setBoughtPracticePack] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState(null);

  const refetchUser = React.useCallback(async (uid) => {
    if (!uid) return null;
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      const fetched = userDoc.exists() ? userDoc.data() || {} : null;
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

  const refreshClaims = async (firebaseUser) => {
    if (!firebaseUser) {
      setIsPaidMember(false);
      setBoughtPracticePack(false);
      return;
    }
    const tokenResult = await firebaseUser.getIdTokenResult(true);
    setIsPaidMember(tokenResult.claims?.isPaidMember === true);
    setBoughtPracticePack(tokenResult.claims?.boughtPracticePack === true);
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await refreshClaims(user);
        refetchUser(user.uid).catch(() => {});
      } else {
        setUser(null);
        setUserProfile(null);
        setIsPaidMember(false);
        setBoughtPracticePack(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [refetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isPaidMember,
        boughtPracticePack,
        userProfile,
        refetchUser,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
