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
  const nodesIfTrue = Component.create({ nodes: ifTrue })
  const nodesIfFalse = Component.create({ nodes: ifFalse })
  
  return useObserver(() =>  <BaseComponent component={condition ? nodesIfTrue : nodesIfFalse } {...props} /> )
  
}

export default Conditional
