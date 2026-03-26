import React, { Children, createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const ContextSection = createContext();

export const SectionProvider = ({ children }) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("sections", (sec) => {
      setSections(sec);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextSection.Provider value={sections}>
      {children}
    </ContextSection.Provider>
  );
};
