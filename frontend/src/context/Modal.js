import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  const openModal = (content) => {
    setContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setContent(null);
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isOpen, content, openModal, closeModal }}>
      {children}
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            {content}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};