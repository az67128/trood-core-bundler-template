import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.module.css'


const Popup = ({
  className,
  width = 320,
  top,
  left,
  bottom,
  right,
  type = 'warning',
  isOpen,
  children,
}) => {
  if (!isOpen) return null

  const style = {
    width,
    top,
    left,
    bottom,
    right,
  }

  return (
    <div className={styles.wrapper}>
      <div style={style} className={classNames(styles.popup, styles[type], className)}>
        {children}
      </div>
    </div>
  )
}

Popup.propTypes = {
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
  isOpen: PropTypes.bool,
  children: PropTypes.node,
}

export default Popup
