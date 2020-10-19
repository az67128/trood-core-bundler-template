import React from 'react'
import BaseComponent from './core/BaseComponent'
import { Component, Page } from 'core/pageStore/index.js'
import { useObserver } from 'mobx-react-lite'
import 'styles/variables.css'

const componentsStore = Component.create({ chunk: 'example/index.json' })
const pageStore = Page.create({})

function App() {
  return useObserver(() => {
    return <BaseComponent component={componentsStore} $page={pageStore} />
  })
}

export default App
