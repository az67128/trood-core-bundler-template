import React, { Fragment } from 'react'
import TButton, { BUTTON_SPECIAL_TYPES } from '$trood/components/TButton'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import ToggleFiltersButton from './ToggleFiltersButton'
import localeService, { intlObject } from '$trood/localeService'
import basePageLayout from '$trood/styles/basePageLayout.css'
import style from './style.css'

const Header = ({ title, addNew, editorActions, form, formActions, filters, search, entities }) => {
  return (
    <Fragment>
      {title || addNew || !search ? (
        <div className={basePageLayout.blockHeaderContainer}>
          {title && <div className={basePageLayout.blockTitle}>{title}</div>}
          {!search || !search.length ? <ToggleFiltersButton {...{ form, formActions, filters }} /> : null}
          {addNew && (
            <TButton
              {...{
                label: entities
                  ? intlObject.intl.formatMessage(localeService.entityMessages[entities.modelType]._object)
                  : intlObject.intl.formatMessage(localeService.generalMessages.add),
                onClick: () => editorActions.editEntity(undefined),
                specialType: BUTTON_SPECIAL_TYPES.addFill,
              }}
            />
          )}
        </div>
      ) : null}
      {search && (
        <div className={basePageLayout.blockHeaderSubContainer}>
          <div className={basePageLayout.blockFiltersContainer}>
            <TInput
              {...{
                className: style.searchInput,
                value: form.search,
                type: INPUT_TYPES.search,
                onChange: (value) => formActions.changeField('search', value),
                placeholder: intlObject.intl.formatMessage(localeService.generalMessages.searching),
                label: intlObject.intl.formatMessage(localeService.generalMessages.search),
              }}
            />
            <ToggleFiltersButton {...{ form, formActions, filters }} />
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Header
