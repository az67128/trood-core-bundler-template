import React from 'react'
import TSelect, { SELECT_TYPES } from '$trood/components/TSelect'
import localeService, { intlObject } from '$trood/localeService'
import basePageLayout from '$trood/styles/basePageLayout.css'

const BoolFilter = ({ label, value, onChange }) => {
  return (
    <TSelect
      {...{
        className: basePageLayout.blockFilter,
        label: label,
        items: [
          {
            value: true,
            label: intlObject.intl.formatMessage(localeService.generalMessages.true),
          },
          {
            value: false,
            label: intlObject.intl.formatMessage(localeService.generalMessages.false),
          },
        ],
        values: value ? value : [],
        onChange,
        type: SELECT_TYPES.dropdown,
        multi: false,
        clearable: true,
        placeHolder: intlObject.intl.formatMessage(localeService.generalMessages.all),
      }}
    />
  )
}

export default BoolFilter
