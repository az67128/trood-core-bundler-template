import React from 'react'
import { useObserver } from 'mobx-react-lite'
import BaseComponent from 'core/BaseComponent'
import { Component } from 'core/pageStore'

// TODO conditional is loosing context
const Conditional = ({
  condition,
  ifTrue,
  ifFalse,
  ...props
}) => {
  const componentsIfTrue = Component.create({ components: ifTrue })
  const componentsIfFalse = Component.create({ components: ifFalse })
  console.log(props)
  return useObserver(() =>  <BaseComponent component={condition ? componentsIfTrue : componentsIfFalse } {...props} /> )
  
}

export default Conditional
