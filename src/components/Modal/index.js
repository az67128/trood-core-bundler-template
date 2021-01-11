import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Block from '../Block'

import styles from './index.module.css'


const Modal = ({
  className,
  width = 320,
  type = 'center',
  isOpen,
  close = () => {},
  closeOnOverlayClick = true,
  children,
}) => {
  const overlayRef = useRef()
  if (!isOpen) return null
  const onOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) close()
  }

  const style = {
    width: type === 'full' ? '100%' : width,
    height: type === 'full' ? '100%' : undefined,
  }

  return (
    <div className={classNames(styles.overlay, styles[type])} onClick={onOverlayClick} ref={overlayRef}>
      <Block style={style} className={classNames(styles.modal, className, styles[type])}>
        {children}
      </Block>
    </div>
  )
}

Modal.propTypes = {
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.oneOf(['full', 'center', 'left', 'right']),
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  closeOnOverlayClick: PropTypes.bool,
  children: PropTypes.node,
}

export default Modal
