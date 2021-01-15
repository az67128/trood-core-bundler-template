import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.module.css'


const Container = ({
  children,
  className = '',
  fluid = false,
  ...other
}) => (
  <div
    {...other}
    className={classNames(
      className,
      styles['aa-Container'],
      !fluid && styles['aa-Container_withMaxWidth'],
    )}
  >
    {children}
  </div>
)

Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]).isRequired,
  className: PropTypes.string,
  fluid: PropTypes.bool,
}

export default Container
