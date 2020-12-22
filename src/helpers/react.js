import React from 'react'


const reactComponentType = Symbol.for('react.element')

export const isReactComponent = (obj) => {
  return obj && obj.$$typeof === reactComponentType
}

export const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export const groupDataAndAriaAttributes = WrappedComponent => props => {
  const mainProps = {}
  const dataAttributes = props.dataAttributes || {}
  const ariaAttributes = props.ariaAttributes || {}

  Object.keys(props).forEach(key => {
    if (key.indexOf('data-') === 0) {
      dataAttributes[key] = props[key]
    } else if (key.indexOf('aria-') === 0) {
      ariaAttributes[key] = props[key]
    } else {
      mainProps[key] = props[key]
    }
  })

  if (Object.keys(dataAttributes).length) {
    mainProps.dataAttributes = { ...dataAttributes }
  }

  if (Object.keys(ariaAttributes).length) {
    mainProps.ariaAttributes = { ...ariaAttributes }
  }

  return (
    <WrappedComponent {...mainProps} />
  )
}
