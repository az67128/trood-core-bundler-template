import React from 'react'

const Context = ({ context, children, ...rest }) => {
  return React.Children.map(children, (child) => React.cloneElement(child, { ...rest, $context: context }))
}

export default Context
