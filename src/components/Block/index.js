import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.module.css'


const Block = (props) => {
  const {
    children,
    className,
    rounded = true,
    transparent = false,
    ...other
  } = props

  return (
    <div
      {...other}
      className={classNames(styles.root, className, rounded && styles.rounded, transparent && styles.transparent)}
    >
      {props.children}
    </div>
  )
}

Block.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  transparent: PropTypes.bool,
}

export default Block
