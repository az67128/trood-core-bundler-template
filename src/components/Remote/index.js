import React from 'react'
import { createRequires, createUseRemoteComponent } from '@paciolan/remote-component'

const resolve = {
  react: require('react'),
  'prop-types': require('prop-types'),
}
const requires = createRequires(resolve)
const useRemoteComponent = createUseRemoteComponent({ requires })

const Remote = (props) => {
  const [loading, err, Component] = useRemoteComponent(props.url)

  if (loading) {
    return <div>Loading...</div>
  }

  if (err != null) {
    return <div>Unknown Error: {err.toString()}</div>
  }

  return <Component {...props} />
}

export default Remote
