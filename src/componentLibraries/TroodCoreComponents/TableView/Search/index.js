import React from 'react'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import TButton, { BUTTON_TYPES } from '$trood/components/TButton'
import style from './style.css'

const Search = ({ form, formActions, filters, search }) => {
  const hasFilter = filters.length > 0
  const toggleFilters = () => {
    formActions.changeField('isFiltersOpen', !form.isFiltersOpen)
  }
  return (
    <div className={style.searchBar}>
      {search && (
        <TInput
          {...{
            className: style.searchInput,
            value: form.search,
            type: INPUT_TYPES.search,
            onChange: (value) => formActions.changeField('search', value),
            onSearch: (value) => formActions.changeField('actualSearch', value),
            placeholder: 'Searching...',
            label: 'Search',
          }}
        />
      )}
      {hasFilter && (
        <TButton
          {...{
            label: form.isFiltersOpen ? 'Close Filters' : 'Open Filters',
            onClick: toggleFilters,
            type: BUTTON_TYPES.text,
          }}
        />
      )}
    </div>
  )
}

export default Search
