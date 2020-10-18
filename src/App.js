import React from 'react'
import BaseComponent from './core/BaseComponent'
import { Component, Page } from 'core/pageStore/index.js'
import pages from 'json'
import 'styles/variables.css'

const componentsStore = Component.create(pages)
const pageStore =  Page.create({})

function App() {
  return <BaseComponent components={componentsStore.components} $page={pageStore} />
}

export default App
