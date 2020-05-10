import React from 'react'
import TSelect, { SELECT_TYPES } from '$trood/components/TSelect'
import { intlObject } from '$trood/localeService'
import { messages } from '../../constants'
import style from '../style.css'

const BoolFilter = ({ label, value, onChange }) => {
  return (
    <TSelect
      {...{
        className: style.filterItem,
        label: label,
        items: [
          {
            value: true,
            label: intlObject.intl.formatMessage(messages.yes),
          },
          {
            value: false,
            label: intlObject.intl.formatMessage(messages.no),
          },
        ],
        values: value ? value : [],
        onChange,
        type: SELECT_TYPES.dropdown,
        multi: false,
        clearable: true,
        placeHolder: intlObject.intl.formatMessage(messages.all),
      }}
    />
  )
}

export default BoolFilter
