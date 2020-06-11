import React from 'react'
import TButton, { BUTTON_TYPES } from '$trood/components/TButton'
import { messages } from '../../constants'
import { intlObject } from '$trood/localeService'

const ToggleFiltersButton = ({ form, filters, formActions }) => {
  const hasFilter = filters.length > 0
  const toggleFilters = () => {
    formActions.changeField('isFiltersOpen', !form.isFiltersOpen)
  }
  return hasFilter ? (
    <TButton
      {...{
        label: form.isFiltersOpen
          ? intlObject.intl.formatMessage(messages.closeFilters)
          : intlObject.intl.formatMessage(messages.openFilters),
        onClick: toggleFilters,
        type: BUTTON_TYPES.text,
      }}
    />
  ) : null
}

export default ToggleFiltersButton
