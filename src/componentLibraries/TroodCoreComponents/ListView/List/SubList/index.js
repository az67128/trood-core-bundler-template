import React, { Fragment } from 'react'
import Card from '../Card'
import { RESTIFY_CONFIG } from 'redux-restify'
import localeService, { intlObject } from '$trood/localeService'
import TButton, { BUTTON_SPECIAL_TYPES } from '$trood/components/TButton'
import { filterFields } from '$trood/componentLibraries/TroodCoreComponents/internal/helpers'
import basePageLayout from '$trood/styles/basePageLayout.css'
import style from './style.css'

const SubList = ({ sublist, PageChildContainer, item }) => {
  const subConfig = sublist ? RESTIFY_CONFIG.registeredModels[sublist.model] : null
  const subFieldList = sublist
    ? filterFields({ meta: subConfig.meta, exclude: sublist.exclude, include: sublist.include })
    : null

  return (
    <PageChildContainer
      {...{
        model: item,
        models: {
          sublist: sublist.model,
        },
      }}
    >
      {({ childSublist, sublistEditorActions }) => {
        const sublistArray = childSublist.getChildArray()
        return (
          <Fragment>
            <div className={style.sublistTitle}>
              <div className={basePageLayout.blockTitle}>
                {intlObject.intl.formatMessage(localeService.entityMessages[sublist.model]._object)}
              </div>
              {sublist.addNew && (
                <TButton
                  {...{
                    label: intlObject.intl.formatMessage(localeService.entityMessages[sublist.model]._object),
                    onClick: () => sublistEditorActions.editEntity(undefined),
                    specialType: BUTTON_SPECIAL_TYPES.addFill,
                  }}
                />
              )}
            </div>
            {sublistArray.map((subItem) => {
              return (
                <Card
                  {...{
                    key: subItem[subConfig.idField],
                    item: subItem,
                    fieldList: subFieldList,
                    config: subConfig,
                    modelType: sublist.model,
                    hideView: sublist.hideView,
                    listEditorActions: sublistEditorActions,
                    editable: sublist.editable,
                  }}
                />
              )
            })}
          </Fragment>
        )
      }}
    </PageChildContainer>
  )
}
export default SubList
