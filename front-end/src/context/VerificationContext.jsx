import { createContext, useContext, useState } from "react";

const VerificationContext = createContext(null);

export const VerificationProvider = ({ children }) => {
  const [verifiedCourses, setVerifiedCourses] = useState(0);
  const [verifiedResources, setVerifiedResources] = useState(0);

  const incrementCourses = () => setVerifiedCourses((n) => n + 1);
  const incrementResources = () => setVerifiedResources((n) => n + 1);

  return (
    <VerificationContext.Provider
      value={{ verifiedCourses, verifiedResources, incrementCourses, incrementResources }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => useContext(VerificationContext);
