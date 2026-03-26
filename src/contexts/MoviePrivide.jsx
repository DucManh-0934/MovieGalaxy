import React, { createContext, useEffect, useState } from 'react';
import { fetchDocumentsRealtime } from '../services/firebaseService';
export const ContextMovie = createContext();

export const MovieProvider = ({ children }) => {
  const [movies,setMovies] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("Movies", (movie) => {
      setMovies(movie);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextMovie.Provider value={movies}>
      {children}
    </ContextMovie.Provider>
  );
};
