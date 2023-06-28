import React, { useRef, useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = React.createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  // callback function that will be called when modal is closing
  const [onModalClose, setOnModalClose] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  const closeModal = () => {
    setFadeOut(true); // trigger fade-out animation
  };

  useEffect(() => {
    // When fadeOut changes to true, start a timer to clear modalContent
    if (fadeOut) {
      const timer = setTimeout(() => {
        setModalContent(null);
        setFadeOut(false); // reset fadeOut for next use
        if (typeof onModalClose === 'function') {
          setOnModalClose(null);
          onModalClose();
        }
      }, 300); // Matches the duration of fade-out animation

      // Cleanup function to clear the timer if unmounted while waiting
      return () => clearTimeout(timer);
    }
  }, [fadeOut, onModalClose]);

  const contextValue = {
    modalRef, // reference to modal div
    modalContent, // React component to render inside modal
    setModalContent, // function to set the React component to render inside modal
    setOnModalClose, // function to set the callback function called when modal is closing
    closeModal, // function to close the modal
    fadeOut,
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal() {
  const { modalRef, modalContent, closeModal, fadeOut } = useContext(ModalContext);
  // If there is no div referenced by the modalRef or modalContent is not a
  // truthy value, render nothing:
  if (!modalRef || !modalRef.current || !modalContent) return null;

  // Render the following component to the div referenced by the modalRef
  return ReactDOM.createPortal(
    <div id="modal" className={fadeOut ? 'fade-out' : ''}>
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">
        {modalContent}
      </div>
    </div>,
    modalRef.current
  );
}

export const useModal = () => useContext(ModalContext);
