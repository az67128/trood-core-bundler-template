import React, { Fragment } from 'react'
import TLabel from '$trood/components/TLabel'
import TButton, { BUTTON_SPECIAL_TYPES } from '$trood/components/TButton'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import ToggleFiltersButton from './ToggleFiltersButton'
import { messages } from '../constants'
import localeService, { intlObject } from '$trood/localeService'
import basePageLayout from '$trood/styles/basePageLayout.css'
import style from './style.css'

const Header = ({ title, addNew, tableEditorActions, form, formActions, filters, search, tableEntities }) => {
  return (
    <Fragment>
      {title || addNew || !search ? (
        <div className={basePageLayout.blockHeaderContainer}>
          {title && <TLabel label={title} className={basePageLayout.blockTitle} />}
          {!search || !search.length ? <ToggleFiltersButton {...{ form, formActions, filters }} /> : null}
          {addNew && (
            <TButton
              {...{
                label: tableEntities
                  ? intlObject.intl.formatMessage(localeService.entityMessages[tableEntities.modelType]._object)
                  : intlObject.intl.formatMessage(messages.add),
                onClick: () => tableEditorActions.editEntity(undefined),
                specialType: BUTTON_SPECIAL_TYPES.addFill,
              }}
            />
          )}
        </div>
      ) : null}
      {search && (
        <div className={basePageLayout.blockFiltersContainer}>
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
