import React, { createContext, useEffect, useState } from 'react';
import { fetchDocumentsRealtime } from '../services/firebaseService';
export const ContextEpisode = createContext();

export const EpisodeProvider = ({ children }) => {
  const [episodes,setEpisodes] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("episodes", (ep) => {
      setEpisodes(ep);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextEpisode.Provider value={episodes}>
      {children}
    </ContextEpisode.Provider>
  );
};
