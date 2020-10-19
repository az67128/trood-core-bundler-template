import { compose } from 'redux'


const reactComponentType = Symbol.for('react.element')

export const isReactComponent = (obj) => {
  return obj && obj.$$typeof === reactComponentType
}

export const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export const applyHocs = (hocFunctions, component) => compose(...hocFunctions)(component)
