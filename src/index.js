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

const meta = {
  custodian: {
    apiHost: 'http://topline.dev.trood.ru/',
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
    },
  },
}
const store = getStore(meta, () => 'Token 3ad0a38e56264934a91f32ec3128b5fb')

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
