import React, { createContext, useEffect, useState } from 'react';
import { fetchDocumentsRealtime } from '../services/firebaseService';
export const ContextLikes = createContext();

export const LikeProvider = ({ children }) => {
  const [Like,setLike] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("Likes", (ep) => {
      setLike(ep);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextLikes.Provider value={Like}>
      {children}
    </ContextLikes.Provider>
  );
};
