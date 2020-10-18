import React, {useEffect} from 'react'
import {Route as RouterRoute} from 'react-router-dom'

const Page = ({children, title})=>{
  useEffect(()=>{
    document.title = title || 'Trood'
  }, [title])
  return children
}

const Route = ({title, children, ...rest})=>{
    
  return <RouterRoute {...rest}><Page title={title}>{children}</Page></RouterRoute>
}
export default Route