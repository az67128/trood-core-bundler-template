import React from 'react'
import ReactDOM from 'react-dom'
import './styles/reset.css'
import './styles/global.css'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { getStore } from 'trood-restify'
import { BrowserRouter as Router } from 'react-router-dom'
import StoreContext from 'core/StoreContext'
import PageStoreContext from 'core/PageStoreContext'
import { Page } from 'core/pageStore'

const pageStore = Page.create({})
//TODO remove after debug
window.pageStore = pageStore
const meta = {
  custodian: {
    apiHost: 'https://legal.dev.trood.ru/',
    entityDataAddress: 'data',
    arrayDataAddress: 'data',
    arrayCountAddress: 'total_count',
    genericTypeAddress: '_object',
    paginationTemplate: 'q=limit({offset},{pageSize})',
    objects: {
      client: {
        pk: 'id',
        endpoint: '/custodian/data/contractor',
        fields: {
          id: 'number',
          name: 'string',
        },
      },
      employee: {
        pk: 'id',
        endpoint: '/custodian/data/employee',
        fields: {
          id: 'number',
          name: 'string',
          email: 'string',
        },
      },
      task: {
        pk: 'id',
        endpoint: '/custodian/data/task',
        fields: {
          id: 'number',
          name: 'string',
        },
      },
      activity: {
        pk: 'id',
        endpoint: '/custodian/data/activity',
        fields: {
          id: 'number',
          name: 'string',
        },
      },
    },
  },
}
const store = getStore(meta, () => 'Token 96ac1d5e7ed24ab8b7dba9f8b0cb9b37')
//TODO remove after debug
window.store = store
ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <PageStoreContext.Provider value={pageStore}>
        <Router>
          <App />
        </Router>
      </PageStoreContext.Provider>
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
