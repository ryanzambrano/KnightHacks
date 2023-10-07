import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key);
  },
};
const supabaseUrl = "https://vzdnrdsqkzwzihnqfong.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6ZG5yZHNxa3p3emlobnFmb25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY2NTYyODksImV4cCI6MjAxMjIzMjI4OX0.6a7ZO4kk-hZqxLpz5QLi11RMi38QpLSBAPFJzhIJ1j0";
export const supabase = createClient(
  "https://vzdnrdsqkzwzihnqfong.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6ZG5yZHNxa3p3emlobnFmb25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY2NTYyODksImV4cCI6MjAxMjIzMjI4OX0.6a7ZO4kk-hZqxLpz5QLi11RMi38QpLSBAPFJzhIJ1j0",
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
