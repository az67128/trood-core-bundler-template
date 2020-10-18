import React from 'react'
import coreComponents from 'components'
import StoreContext from 'core/StoreContext'
import { useObserver } from 'mobx-react-lite'
import { useLocation, useParams } from 'react-router-dom'


const getData = (path, $data) => {
    
  const connectedPath = path.replace(/\[.*?\]/g, (replacement)=>{
    const parsedParams = JSON.parse(replacement)
    const connectedParams = parsedParams.map((param) => {
      // TODO: fix conveersion id from string to number
      return typeof param === 'object' && param.$type === '$data' ? Number(getData(param.path, $data)) : param
    })
    return JSON.stringify(connectedParams)
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

function applyTemplate(template, map, fallback='') {
  return template.replace(/\$\{[^}]+\}/g, (match) => 
    match
      .slice(2, -1)
      .trim()
      .split('.')
      .reduce(
        (searchObject, key) => searchObject[key] || fallback || match,
        map,
      ),
  )
}

const BaseComponent = ({ components, $context, $page }) => {
  const store = React.useContext(StoreContext)
  const location = useLocation()
  const params = useParams()
    
  const $data = { $store: store, $route:{params, location}, $context, $page }

  return useObserver(() => {
    if (!components) return null
    return components.map((component) => {
      const Component = coreComponents[component.name] || component.name
      const childBaseComponent = (
        <BaseComponent key="Base" components={component.components} $context={$context} $page={$page} />
      )
      const connectedProps = component.props
        ? Object.keys(component.props).reduce(
          (memo, key) => {
            const item = component.props[key]
            if (typeof item === 'object' && item.$type === '$data') {
              let propValue = getData(item.path, $data)
              
              if(item.tamplate) {
                propValue = applyTemplate(item.tamplate, {value:propValue})
              }
              return { ...memo, [key]: propValue }
            }

            if (typeof item === 'object' && item.$type === '$expression') {
              const val = getData(item.rule[0].path, $data)
              return { ...memo, [key]: val === item.rule[1] ? item.rule[2] : item.rule[3] }
            }

            if (typeof item === 'object' && item.$type === '$action') {
              const action = () => getData(item.path, $data)(...item.args)
              return { ...memo, [key]: action }
            }
            if (key === 'children') {
              return {
                ...memo,
                [key]: [...component.props[key], childBaseComponent],
              }
            }

            return memo
          },
          { ...component.props },
        )
        : {}
      if (!connectedProps.children && component.name !== 'img') connectedProps.children = [childBaseComponent]

      // console.log(`render of ${component.name || component.name}-${component.id}`);

      return <Component key={component.id} {...connectedProps} />
    })
  })
}
export default BaseComponent
