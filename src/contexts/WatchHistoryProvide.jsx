import React, { createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const ContextWatchHistory = createContext();

export const WatchHistoryProvider = ({ children }) => {
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    const unsubcribe = fetchDocumentsRealtime("WatchHistory", (data) => {
      setWatchHistory(data);
    });
    return () => unsubcribe();
  }, []);

  return (
    <ContextWatchHistory.Provider value={watchHistory}>
      {children}
    </ContextWatchHistory.Provider>
  );
};