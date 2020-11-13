import React, { useRef } from 'react'
import './style.css'

const Modal = ({ isOpen, children, close, closeOnOverlayClick = true, className = '' }) => {
  const overlayRef = useRef()
  if (!isOpen) return null
  const onOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) close()
  }
  return (
    <div className="overlay" onClick={onOverlayClick} ref={overlayRef}>
      <div className={`modal ${className}`}>{children}</div>
    </div>
  )
}

export default Modal
