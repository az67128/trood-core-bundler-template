import React from 'react'
import { Redirect } from 'react-router-dom'

import { stringify } from 'qs'


const QueryRedirect = (props) => {
  return (
    <Redirect {...props} to={{ ...props.to, search: stringify(props.to.query) }} />
  )
}

export default QueryRedirect
