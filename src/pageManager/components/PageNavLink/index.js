import React from 'react'
import { NavLink } from 'react-router-dom'

import { getNestedObjectField } from '$trood/helpers/nestedObjects'

import { getUrl } from '../../urlSchema'
import { PageManagerContext } from '../../constants'
import { getIsAllowPath } from '../../helpers'


const PageNavLink = ({
  baseUrl,
  navKey,
  className,
  activeClassName,
  children,
}) => {
  return (
    <PageManagerContext.Consumer>
      {({ match, registeredRoutesPaths }) => {
        const to = getUrl(getNestedObjectField(baseUrl, navKey), match.params)
        // if (!getIsAllowPath(to, registeredRoutesPaths)) return null
        return (
          <NavLink {...{
            key: navKey,
            to,
            activeClassName,
            className,
          }}>
            {children}
          </NavLink>
        )
      }}
    </PageManagerContext.Consumer>
  )
}

export default PageNavLink

