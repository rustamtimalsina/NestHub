import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const addToCompare = (property) => {
    if (compareList.some((p) => p.id === property.id)) {
      setCompareList((prev) => prev.filter((p) => p.id !== property.id));
      toast.info("Removed from comparison");
      return;
    }

    if (compareList.length >= 4) {
      toast.warn("You can compare up to 4 properties at a time.");
      return;
    }

    setCompareList((prev) => [...prev, property]);
    toast.success(`Added "${property.title}" to compare list`);
  };

  const removeFromCompare = (propertyId) => {
    setCompareList((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (propertyId) => {
    return compareList.some((p) => p.id === propertyId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        isCompareOpen,
        setIsCompareOpen,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
