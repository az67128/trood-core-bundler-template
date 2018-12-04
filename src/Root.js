import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd'

import app from '$trood/app'


const Root = ({
  store,
  history,
}) => {
  return (
    <DragDropContextProvider backend={HTML5Backend}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {React.createElement(app.container)}
        </ConnectedRouter>
      </Provider>
    </DragDropContextProvider>
  )
}

export default Root
