import React from 'react'

import localeService, { intlObject } from '$trood/localeService'


const BoolDiff = ({ model, fieldName, arrowComp }) => {
  const newValue = model.diff[fieldName].update
  const prevValue = model.revision[fieldName]
  return (
    <React.Fragment>
      <div>
        {intlObject.intl.formatMessage(
          prevValue ? localeService.generalMessages.true : localeService.generalMessages.false,
        )}
      </div>
      {arrowComp}
      <div>
        {intlObject.intl.formatMessage(
          newValue ? localeService.generalMessages.true : localeService.generalMessages.false,
        )}
      </div>
    </React.Fragment>
  )
}

export default BoolDiff
