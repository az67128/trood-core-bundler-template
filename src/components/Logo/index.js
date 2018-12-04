import React from 'react'
import style from './index.css'
import classNames from 'classnames'


const Logo = ({
  className,
  size,
}) => {
  return (
    <div {...{
      className: classNames(style.root, className),
      style: {
        width: size,
        height: size,
      },
    }}>
      <img src="/static/img/TroodLogo.png" alt="TROOD" />
    </div>
  )
}

export default Logo
