import React, { Children, createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const ContextPlan = createContext();

export const PlanProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    //Sử dụng fetchDocumentsRealtime để lắng nghe dữ liệu realtime
    const unsubcribe = fetchDocumentsRealtime("Plans", (ca) => {
      setPlans(ca);
    });

    //Hủy lắng nghe khi component bị unmount
    return () => unsubcribe();
  }, []);
  
  return (
    <ContextPlan.Provider value={plans}>
      {children}
    </ContextPlan.Provider>
  );
};
