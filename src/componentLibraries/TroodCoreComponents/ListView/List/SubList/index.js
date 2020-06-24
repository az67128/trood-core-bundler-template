import React from 'react'
import Card from '../Card'
import { RESTIFY_CONFIG } from 'redux-restify'
import localeService, { intlObject } from '$trood/localeService'
import TButton, { BUTTON_SPECIAL_TYPES } from '$trood/components/TButton'
import { filterFields } from '$trood/componentLibraries/TroodCoreComponents/internal/helpers'
import basePageLayout from '$trood/styles/basePageLayout.css'
import style from './style.css'

const SubList = ({
  sublist: { model, exclude = [], include = [] },
  PageChildContainer,
  item,
  addNew = false,
  hideView = false,
  editable = false,
}) => {
  const subConfig = RESTIFY_CONFIG.registeredModels[model]
  const subFieldList = filterFields({ meta: subConfig.meta, exclude: exclude, include: include })
  return (
    <PageChildContainer
      {...{
        model: item,
        models: {
          sublist: model,
        },
      }}
    >
      {({ childSublist, sublistEditorActions }) => {
        const sublistArray = childSublist.getChildArray()
        if (sublistArray.length === 0 && !addNew) return null
        return (
          <div className={style.sublist}>
            <div className={style.sublistTitle}>
              <div className={basePageLayout.blockTitle}>
                {intlObject.intl.formatMessage(localeService.entityMessages[model]._object)}
              </div>
              {addNew && (
                <TButton
                  {...{
                    label: intlObject.intl.formatMessage(localeService.entityMessages[model]._object),
                    onClick: () => sublistEditorActions.editEntity(undefined),
                    specialType: BUTTON_SPECIAL_TYPES.addFill,
                  }}
                />
              )}
            </div>
            {sublistArray.map((subItem) => {
              return (
                <div {...{ key: subItem[subConfig.idField], className: style.sublistItem }}>
                  <Card
                    {...{
                      item: subItem,
                      fieldList: subFieldList,
                      config: subConfig,
                      modelType: model,
                      hideView: hideView,
                      listEditorActions: sublistEditorActions,
                      editable: editable,
                    }}
                  />
                </div>
              )
            })}
          </div>
        )
      }}
    </PageChildContainer>
  )
}
export default SubList
