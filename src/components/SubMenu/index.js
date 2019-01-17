import React from 'react'
import classNames from 'classnames'

import style from './index.css'


const SubMenu = ({
  thin,
  vertical,
  items = [],
  className,
  selectedItem,
  onChange,
}) => {
  const currentItem = items.find(item => item.id === selectedItem)
  if (items.length < 2) return null
  return (
    <React.Fragment>
      <div className={classNames(style.root, thin && style.thin, vertical && style.vertical, className)}>
        {items.map(item => {
          if (!item) return undefined
          return (
            <div {...{
              key: item.id,
              'data-cy': item.id,
              className: classNames(style.link, item.id === selectedItem && style.active),
              onClick: () => onChange(item.id),
            }}>
              {item.label}
            </div>
          )
        })}
      </div>
      {currentItem && currentItem.content}
    </React.Fragment>
  )
}

export default SubMenu
