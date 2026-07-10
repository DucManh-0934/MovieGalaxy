import React, { Children, createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const ContextFeatures = createContext();

export const FeaturesProvider = ({ children }) => {
  const [Features, setFeatures] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("featuries", (ca) => {
      setFeatures(ca);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextFeatures.Provider value={Features}>
      {children}
    </ContextFeatures.Provider>
  );
};
