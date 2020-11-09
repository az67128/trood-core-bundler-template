import React from 'react'
import { createRequires, createUseRemoteComponent } from '@paciolan/remote-component'
import { resolve } from 'remote-component.config'

import LoadingIndicator from '../LoadingIndicator'


const requires = createRequires(resolve)
const useRemoteComponent = createUseRemoteComponent({ requires })

const Remote = (props) => {
  const [loading, err, Component] = useRemoteComponent(props.url)

  if (loading) {
    return <LoadingIndicator />
  }

  if (err != null) {
    return <div>Unknown Error: {err.toString()}</div>
  }

  return <Component {...props} />
}

export default Remote
