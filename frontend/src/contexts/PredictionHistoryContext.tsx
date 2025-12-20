import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PredictionRecord {
  id: string;
  marks: number;
  attendance: number;
  feedback: string;
  risk: "Good" | "Average" | "At-Risk";
  sentiment: "Positive" | "Neutral" | "Negative";
  reasons: string[];
  timestamp: string;
}

interface PredictionHistoryContextType {
  predictions: PredictionRecord[];
  addPrediction: (prediction: Omit<PredictionRecord, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

const PredictionHistoryContext = createContext<PredictionHistoryContextType | undefined>(undefined);

export const PredictionHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);

  // Load predictions from localStorage on mount
  useEffect(() => {
    const savedPredictions = localStorage.getItem('academic-insight-predictions');
    if (savedPredictions) {
      setPredictions(JSON.parse(savedPredictions));
    }
  }, []);

  // Save predictions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('academic-insight-predictions', JSON.stringify(predictions));
  }, [predictions]);

  const addPrediction = (prediction: Omit<PredictionRecord, 'id' | 'timestamp'>) => {
    const newPrediction: PredictionRecord = {
      ...prediction,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    setPredictions((prev) => [newPrediction, ...prev]);
  };

  const clearHistory = () => {
    setPredictions([]);
    localStorage.removeItem('academic-insight-predictions');
  };

  return (
    <PredictionHistoryContext.Provider
      value={{
        predictions,
        addPrediction,
        clearHistory,
      }}
    >
      {children}
    </PredictionHistoryContext.Provider>
  );
};

export const usePredictionHistory = () => {
  const context = useContext(PredictionHistoryContext);
  if (context === undefined) {
    throw new Error('usePredictionHistory must be used within a PredictionHistoryProvider');
  }
  return context;
};
