import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, useLocation } from 'react-router'
import classNames from 'classnames'
import BaseComponent from 'core/BaseComponent'
import { Component } from 'core/pageStore'

import styles from './index.module.css'

const getPathname = (path, basePath, location) => {
  const basePathArray = basePath.split('/').filter(v => v)
  const currentPathArray = /^\//.test(path) ? [] : location.pathname.split('/').filter(v => v)
  const nextPathArray = [...basePathArray, ...currentPathArray.slice(0, currentPathArray.length - 1)]
  nextPathArray.push(...path.split('/').filter(v => v))
  return `/${nextPathArray.join('/')}`
}

const Menu = ({
  className,
  basePath = '',
  type = 'vertical',
  items = [],
  itemActiveStyle,
}) => {
  const location = useLocation()

  if (items.length <= 1) return null

  let redirectTo

  const menuItems = items.map(item => {
    const nodes = []
    let to
    if (!item.path) {
      nodes.push({
        type: 'div',
        props: {
          className: styles.link,
        },
        nodes: item.title,
      })
    } else {
      to = getPathname(item.path, basePath, location)

      if (!redirectTo && item.redirectTo && item.path === location.pathname) {
        redirectTo = getPathname(item.redirectTo, basePath, location)
      }

      nodes.push({
        type: 'NavLink',
        props: {
          to,
          className: styles.link,
          activeClassName: styles.activeLink,
          activeStyle: itemActiveStyle,
          children: item.children,
        },
        nodes: [item.title || item.path],
      })
    }
    if (item.items) {
      nodes.push({
        type: 'Menu',
        props: {
          className: styles.subMenu,
          basePath: to,
          type,
          items: item.items,
          itemActiveStyle,
        },
        nodes: [item.title || item.path],
      })
    }
    return {
      type: 'div',
      props: {
        className: styles.menuItem,
      },
      nodes,
    }
  })
  const menuItemsStore = Component.create({ nodes: menuItems })

  return (
    <div className={classNames(className, styles.root, styles[type])}>
      <BaseComponent component={menuItemsStore} />
      {redirectTo && (
        <Redirect to={redirectTo} />
      )}
    </div>
  )
}

const maxItemsDepth = 3
let itemsDepth = 0

const getItemsPropType = () => {
  if (itemsDepth < maxItemsDepth) {
    itemsDepth += 1
    return PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string,
      title: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.object,
      ]),
      redirectTo: PropTypes.string,
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.object,
      ]),
      items: getItemsPropType(),
    }))
  }
  return PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    title: PropTypes.string,
    redirectTo: PropTypes.string,
    children: PropTypes.node,
  }))
}

Menu.propTypes = {
  className: PropTypes.string,
  basePath: PropTypes.string,
  type: PropTypes.oneOf(['vertical', 'horizontal']),
  itemActiveStyle: PropTypes.object,
  items: getItemsPropType(),
}

export default Menu
