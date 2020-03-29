import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider  } from 'react-dnd'

import app from '$trood/app'

import { LocalizeServiceProvider } from '$trood/localeService'


const Root = ({
  store,
  history,
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
        <LocalizeServiceProvider>
          <ConnectedRouter history={history}>
            {React.createElement(app.container)}
          </ConnectedRouter>
        </LocalizeServiceProvider>
      </Provider>
    </DndProvider>
  )
}

export default Root
