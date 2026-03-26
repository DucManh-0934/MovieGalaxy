import React, { createContext, useEffect, useState } from 'react';
import { fetchDocumentsRealtime } from '../services/firebaseService';
export const ContextActor = createContext();

export const ActorProvider = ({ children }) => {
  const [actors,setActors] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("actors", (ca) => {
      setActors(ca);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextActor.Provider value={actors}>
      {children}
    </ContextActor.Provider>
  );
};
