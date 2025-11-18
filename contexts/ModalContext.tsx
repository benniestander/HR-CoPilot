import React, { createContext, useContext, useState, useCallback } from 'react';

interface LegalModalState {
  title: string;
  content: string;
  onClose: () => void;
}

interface ConfirmationModalState {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
}

interface ModalContextType {
  legalModalContent: LegalModalState | null;
  confirmation: ConfirmationModalState | null;
  showLegalModal: (title: string, content: string) => void;
  hideLegalModal: () => void;
  showConfirmationModal: (options: ConfirmationModalState) => void;
  hideConfirmationModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [legalModalContent, setLegalModalContent] = useState<LegalModalState | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationModalState | null>(null);

  const hideLegalModal = useCallback(() => setLegalModalContent(null), []);
  const hideConfirmationModal = useCallback(() => setConfirmation(null), []);

  const showLegalModal = useCallback((title: string, content: string) => {
    setLegalModalContent({ title, content, onClose: hideLegalModal });
  }, [hideLegalModal]);

  const showConfirmationModal = useCallback((options: ConfirmationModalState) => {
    setConfirmation(options);
  }, []);

  const value = {
    legalModalContent,
    confirmation,
    showLegalModal,
    hideLegalModal,
    showConfirmationModal,
    hideConfirmationModal,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
