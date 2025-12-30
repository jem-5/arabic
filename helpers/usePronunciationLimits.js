"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

const FREE_DAILY_LIMIT = 10;

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function usePronunciationLimits({ user, isPaidMember }) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const limit = isPaidMember ? Infinity : FREE_DAILY_LIMIT;
  const remaining = Math.max(limit - count, 0);
  const limitReached = !isPaidMember && count >= FREE_DAILY_LIMIT;

  useEffect(() => {
    if (!user) {
      setCount(0);
      setLoading(false);
      return;
    }

    const load = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setCount(0);
        setLoading(false);
        return;
      }

      const data = snap.data();
      const today = todayKey();

      if (data.pronunciation?.date === today) {
        setCount(data.pronunciation.count || 0);
      } else {
        setCount(0);
      }

      setLoading(false);
    };

    load();
  }, [user, isPaidMember]);

  // Increment usage (call after a score is produced)
  const increment = useCallback(async () => {
    if (!user || isPaidMember) return;

    const ref = doc(db, "users", user.uid);
    const today = todayKey();

    setCount((prev) => prev + 1);

    await setDoc(
      ref,
      {
        pronunciation: {
          date: today,
          count: count + 1,
        },
      },
      { merge: true }
    );
  }, [user, isPaidMember, count]);

  return {
    loading,
    count,
    remaining,
    limitReached,
    isUnlimited: isPaidMember,
    increment,
  };
}
