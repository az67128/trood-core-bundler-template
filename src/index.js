import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { getStore } from 'trood-restify'
import { BrowserRouter as Router } from 'react-router-dom'
import StoreContext from 'core/StoreContext'

const meta = {
  custodian: {
    apiHost: 'https://trood.trood.legal/',
    entityDataAddress: 'data',
    arrayDataAddress: 'data',
    arrayCountAddress: 'total_count',
    objects: {
      client: {
        pk: 'id',
        endpoint: '/custodian/data/client',
        fields: {
          id: 'number',
          name: 'string',

          revenue: 'number',
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
    },
  },
}
const store = getStore(meta, () => 'Token 8dae765ac3e8487e8f5e0a07c617864b')
window.store = store
ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <Router>
        <App />
      </Router>
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
