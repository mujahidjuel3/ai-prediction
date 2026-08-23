"use client";

import { CURRENT_USER } from "@/lib/constants";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

const PROFILE_STORAGE_KEY = "academic-sentinel-profile";

export interface ProfileData {
  name: string;
  role: string;
  email: string;
  department: string;
  image: string;
}

interface ProfileContextValue {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

const defaultProfile: ProfileData = {
  name: CURRENT_USER.name,
  role: CURRENT_USER.role,
  email: CURRENT_USER.email,
  department: CURRENT_USER.department,
  image: "",
};

function subscribe(onChange: () => void) {
  window.addEventListener("academic-sentinel-profile-change", onChange);
  return () => window.removeEventListener("academic-sentinel-profile-change", onChange);
}

function getStoredProfile() {
  return window.localStorage.getItem(PROFILE_STORAGE_KEY);
}

function getServerProfile() {
  return null;
}

function parseProfile(storedProfile: string | null): ProfileData {
  if (!storedProfile) return defaultProfile;
  try {
    return { ...defaultProfile, ...JSON.parse(storedProfile) };
  } catch {
    return defaultProfile;
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const storedProfile = useSyncExternalStore(subscribe, getStoredProfile, getServerProfile);
  const profile = parseProfile(storedProfile);

  function updateProfile(updates: Partial<ProfileData>) {
    const nextProfile = { ...profile, ...updates };
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    window.dispatchEvent(new Event("academic-sentinel-profile-change"));
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within ProfileProvider");
  return context;
}