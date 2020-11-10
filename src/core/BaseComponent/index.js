import React from 'react'
import coreComponents from 'components'
import StoreContext from 'core/StoreContext'
import PageStoreContext from 'core/PageStoreContext'
import { useObserver } from 'mobx-react-lite'
import { useLocation, useParams } from 'react-router-dom'
import { Parser } from 'expr-eval'

const connectProps = (props, $data, childBaseComponent) => {
  const getData = (path, $data) => {
    const connectedPath = path.replace(/\[.*?\]/g, (replacement) => {
      const parsedParams = JSON.parse(replacement)
      const connectedParams = parsedParams.map(param => connectProps(param, $data))
      return JSON.stringify(Object.values(connectedParams))
    })

    const paths = connectedPath.split('.')

    return paths.reduce((memo, key) => {
      if (memo === undefined) return memo
      if (memo[key]) return memo[key]
      const params = /\[.*\]/g.exec(key)
      if (params && params[0]) {
        const action = key.split('[')[0]
        const parsedParams = JSON.parse(params)
        return memo[action](...parsedParams)
      }
      return undefined
    }, $data)
  }
  if(typeof props !== 'object') return props
  if (!props) return {}
  return Object.keys(props).reduce(
    (memo, key) => {
      const item = props[key]
      if (typeof item === 'object' && item.$type === '$data') {
        const propValue = typeof item.path === 'object' ? connectProps(item.path, $data) : getData(item.path, $data)
        return { ...memo, [key]: propValue }
      }

      if (typeof item === 'object' && item.$type === '$expression') {
        const parser = new Parser()
        parser.functions.data = function (path) {
          return getData(path, $data)
        }
        const val = parser.evaluate(item.expression)
        return { ...memo, [key]: val }
      }

      if (typeof item === 'object' && item.$type === '$action') {
        const connectedFunction = getData(item.path, $data)
        const action = ($event) => {
          const connectedArgs = connectProps(item.args, { ...$data, $event })
          return connectedFunction(...Object.values(connectedArgs))
        }
        return { ...memo, [key]: action }
      }
      if (key === 'children' && childBaseComponent) {
        return {
          ...memo,
          [key]: [...props[key], childBaseComponent],
        }
      }

      return memo
    },
    { ...props },
  )
}
const skipElements = ['img', 'input']

const BaseComponent = ({ component, $context }) => {
  const $store = React.useContext(StoreContext)
  const $page = React.useContext(PageStoreContext)

  React.useEffect(() => {
    if (component) component.loadChunk()
  }, [component])
  const location = useLocation()
  const params = useParams()

  const $data = { $store, $route: { params, location }, $context, $page }

  return useObserver(() => {
    if (!component || !component.components) return null
    return component.components.map((childComponent) => {
      const Component = coreComponents[childComponent.name] || childComponent.name
      const childBaseComponent = <BaseComponent key="Base" component={childComponent} $context={$context} />
      const connectedProps = childComponent.props
        ? connectProps(childComponent.props, $data, childBaseComponent)
        : {}
      if (!connectedProps.children && !skipElements.includes(childComponent.name)) {
        connectedProps.children = [childBaseComponent]
      }

      return <Component key={childComponent.id} {...connectedProps} />
    })
  })
}
export default BaseComponent
