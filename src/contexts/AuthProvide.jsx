import React, { createContext, useEffect, useState } from 'react';
import { fetchDocumentsRealtime } from '../services/firebaseService';
export const ContextAuth = createContext();

export const AuthProvider = ({ children }) => {
  const [accounts,setAccounts] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("accounts", (ca) => {
      setAccounts(ca);
    });
    
    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextAuth.Provider value={accounts}>
      {children}
    </ContextAuth.Provider>
  );
};
