import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import style from './index.css'

import { PageManagerContext } from '../../constants'
import { getEntityPageUrl } from '../../urlSchema'
import { getIsAllowPath } from '../../helpers'


const EntityPageLink = ({
  model = {},
  className,
  children,
}) => {
  return (
    <PageManagerContext.Consumer>
      {({ registeredRoutesPaths }) => {
        let to
        let isAllowPath = !!model.$modelType
        if (isAllowPath) {
          to = getEntityPageUrl(model.$modelType, model.id)
          isAllowPath = getIsAllowPath(to, registeredRoutesPaths)
        }
        const Component = isAllowPath ? Link : props => <div {...props} />
        return (
          <Component {...{
            to: isAllowPath ? to : undefined,
            className: classNames(style.root, className),
          }}>
            {children}
          </Component>
        )
      }}
    </PageManagerContext.Consumer>
  )
}

export default EntityPageLink

