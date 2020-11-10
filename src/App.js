import React from 'react'
import BaseComponent from './core/BaseComponent'
import { Component } from 'core/pageStore/index.js'
import { useObserver } from 'mobx-react-lite'
import 'styles/variables.css'

const componentsStore = Component.create({ chunk: process.env.REACT_APP_ENTRY_COMPONENT_CHUNK })


function App() {
  return useObserver(() => {
    return <BaseComponent component={componentsStore}/>
  })
}

export default App
