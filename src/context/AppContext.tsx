import React, { createContext, useContext, useState } from "react";

export interface PredictionResult {
  risk_level: string;
  risk_percent: number;
  causes: string[];
  recommendations: string[];
  prevention: string[];
}

interface AppContextType {
  result: PredictionResult | null;
  setResult: (result: PredictionResult | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  return (
    <AppContext.Provider value={{ result, setResult }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
