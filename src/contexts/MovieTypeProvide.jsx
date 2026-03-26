import React, { Children, createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const ContextMovieType = createContext();

export const MovieTypeProvider = ({ children }) => {
  const [movieTypes, setMovieTypes] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("movietypes", (ca) => {
      setMovieTypes(ca);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextMovieType.Provider value={movieTypes}>
      {children}
    </ContextMovieType.Provider>
  );
};
