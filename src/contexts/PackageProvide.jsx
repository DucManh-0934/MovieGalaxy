import React, { Children, createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const ContextPackage = createContext();

export const PackageProvider = ({ children }) => {
  const [Package, setPackage] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("packages", (ca) => {
      setPackage(ca);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextPackage.Provider value={Package}>
      {children}
    </ContextPackage.Provider>
  );
};
