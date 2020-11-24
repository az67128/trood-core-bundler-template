import React from 'react'
import ContextContext from 'core/ContextContext'

const Context = ({ context, children }) => {
  return <ContextContext.Provider value={context}>
    {children}
  </ContextContext.Provider>
}

export default Context
