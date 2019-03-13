import React from 'react'
import classNames from 'classnames'

import style from './index.css'


const NotAllowed = ({
  className = '',
}) => {
  return (
    <div className={classNames(style.root, className)}>
      Извините, эта страница вам не доступна!
    </div>
  )
}

export default NotAllowed
