import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { checkAccess } from '../services/authService';

const AccessContext = createContext();

export const AccessProvider = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAccess = async () => {
    try {
      await checkAccess();
      setHasAccess(true);
    } catch {
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAccess();
  }, []);

  const contextValue = useMemo(
    () => ({ hasAccess, setHasAccess, refreshAccess, loading }),
    [hasAccess, loading]
  );

  return (
    <AccessContext.Provider value={contextValue}>
      {children}
    </AccessContext.Provider>
  );
};

export const useAccess = () => useContext(AccessContext);
