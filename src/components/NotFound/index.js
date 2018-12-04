import React from 'react'
import classNames from 'classnames'

import style from './index.css'


const NotFound = ({
  className = '',
}) => {
  return (
    <div className={classNames(style.root, className)}>
      404
    </div>
  )
}

export default NotFound
