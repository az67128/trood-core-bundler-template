import React from 'react'
import classNames from 'classnames'

import styles from './index.module.css'


const Block = (props) => {
  const {
    children,
    className,
    rounded = true,
    transparent = false,
    bddmark = 'блок',
    ...other
  } = props

  return (
    <div
      {...other}
      bddmark={bddmark}
      className={classNames(styles.root, className, rounded && styles.rounded, transparent && styles.transparent)}
    >
      {props.children}
    </div>
  )
}

export default Block
