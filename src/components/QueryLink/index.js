import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import { stringify } from 'qs'


const QueryLink = (props) => {
  const LinkComp = props.activeClassName || props.activeStyle ? NavLink : Link
  return (
    <LinkComp {...props} to={{ ...props.to, search: stringify(props.to.query) }} />
  )
}

export default QueryLink

export * from './constants'
