import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.module.css'


const Row = ({
  children,
  className = '',
  noGutters = false,
  verticalPadding,
  topPadding,
  bottomPadding,
  ...other
}) => {
  const style = {
    paddingTop: `${verticalPadding || topPadding}px`,
    paddingBottom: `${verticalPadding || bottomPadding}px`,
  }

  return (
    <div
      {...other}
      style={style}
      className={classNames(
        className,
        styles['aa-Row'],
        noGutters && styles['aa-Row_noGutters'],
      )}
    >
      {children}
    </div>
  )
}

Row.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]).isRequired,
  className: PropTypes.string,
  noGutters: PropTypes.bool,
  verticalPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  topPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bottomPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default Row
