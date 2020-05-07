import React from 'react'
import TSelect, { SELECT_TYPES } from '$trood/components/TSelect'
import style from '../style.css'

const BoolFilter = ({ fieldName, value, onChange }) => {
  return (
    <TSelect
      {...{
        className: style.filterItem,
        label: fieldName,
        items: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
          {
            value: null,
            label: 'All',
          },
        ],
        values: value ? value : [],
        onChange,
        type: SELECT_TYPES.dropdown,
        multi: false,
        clearable: true,
        placeHolder: 'All',
      }}
    />
  )
}

export default BoolFilter
