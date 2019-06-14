import React from 'react'

import { messages } from '$trood/mainConstants'
import { intlObject } from '$trood/localeService'


const BoolDiff = ({ model, fieldName, arrowComp }) => {
  const newValue = model.diff[fieldName].update
  const prevValue = model.revision[fieldName]
  return (
    <React.Fragment>
      <div>{intlObject.intl.formatMessage(prevValue ? messages.true : messages.false)}</div>
      {arrowComp}
      <div>{intlObject.intl.formatMessage(newValue ? messages.true : messages.false)}</div>
    </React.Fragment>
  )
}

export default BoolDiff
