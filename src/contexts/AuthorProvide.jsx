import React, { createContext, useEffect, useState } from 'react';
import { fetchDocumentsRealtime } from '../services/firebaseService';
export const ContextAuthor = createContext();

export const AuthorProvider = ({ children }) => {
  const [authors,setAuthors] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("authors", (ca) => {
      setAuthors(ca);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextAuthor.Provider value={authors}>
      {children}
    </ContextAuthor.Provider>
  );
};
