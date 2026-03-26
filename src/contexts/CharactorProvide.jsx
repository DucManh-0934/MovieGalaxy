import React, { createContext, useEffect, useState } from 'react';
import { fetchDocumentsRealtime } from '../services/firebaseService';
export const ContextCharactor = createContext();

export const CharacterProvider = ({ children }) => {
  const [characters,setCharacters] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("Charactors", (ca) => {
      setCharacters(ca);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextCharactor.Provider value={characters}>
      {children}
    </ContextCharactor.Provider>
  );
};
