import React, { Children, createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const ContextRent = createContext();

export const RentProvider = ({ children }) => {
  const [rent, setRent] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("RentHistory", (sec) => {
      setRent(sec);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextRent.Provider value={rent}>
      {children}
    </ContextRent.Provider>
  );
};
