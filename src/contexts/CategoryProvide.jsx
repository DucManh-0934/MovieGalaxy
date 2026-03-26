import React, { Children, createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const ContextCategories = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("categories", (ca) => {
      setCategories(ca);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextCategories.Provider value={categories}>
      {children}
    </ContextCategories.Provider>
  );
};
