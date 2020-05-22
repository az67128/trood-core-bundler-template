import React, { Fragment } from 'react'
import TLabel from '$trood/components/TLabel'
import TButton, { BUTTON_SPECIAL_TYPES } from '$trood/components/TButton'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import ToggleFiltersButton from './ToggleFiltersButton'
import { messages } from '../constants'
import { intlObject } from '$trood/localeService'
import style from './style.css'

const Header = ({ title, addNew, tableEditorActions, form, formActions, filters, search }) => {
  return (
    <Fragment>
      {title || addNew ? (
        <div className={style.header}>
          {title && <TLabel label={title} className={style.headerTitle} />}
          {!search || !search.length ? <ToggleFiltersButton {...{ form, formActions, filters }} /> : null}
          {addNew && (
            <TButton
              {...{
                label: intlObject.intl.formatMessage(messages.add),
                onClick: () => tableEditorActions.editEntity(undefined),
                specialType: BUTTON_SPECIAL_TYPES.addFill,
              }}
            />
          )}
        </div>
      ) : null}
      {search && (
        <div className={style.searchBar}>
          <TInput
            {...{
              className: style.searchInput,
              value: form.search,
              type: INPUT_TYPES.search,
              onChange: (value) => formActions.changeField('search', value),
              placeholder: intlObject.intl.formatMessage(messages.searchPlaceholder),
              label: intlObject.intl.formatMessage(messages.search),
            }}
          />
          <ToggleFiltersButton {...{ form, formActions, filters }} />
        </div>
      )}
    </Fragment>
  )
}

export default Header
