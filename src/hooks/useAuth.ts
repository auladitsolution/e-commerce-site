"use client";

import { useState, useEffect } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseClient";
import { toast } from "sonner";

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (usr) => {
        setUser(usr);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      toast.success(`স্বাগতম, ${res.user.displayName || "গ্রাহক"}!`);
      return res.user;
    } catch (err: unknown) {
      console.error(err);
      toast.error("লগইন সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.info("আপনি সফলভাবে লগআউট হয়েছেন");
    } catch (err: unknown) {
      console.error(err);
      toast.error("লগআউট করা যায়নি");
    }
  };

  return {
    user,
    loading,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
  };
}
