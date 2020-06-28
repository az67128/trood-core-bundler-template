import React, { useState } from 'react'
import TSelect, { SELECT_TYPES } from '$trood/components/TSelect'
import { templateApplyValues } from '$trood/helpers/templates'
import { camelToLowerSnake } from '$trood/helpers/namingNotation'
import { RESTIFY_CONFIG } from 'redux-restify'
import { intlObject } from '$trood/localeService'
import { messages } from '../../constants'
import basePageLayout from '$trood/styles/basePageLayout.css'

const DropdownFilter = ({ fieldName, linkName, label, value, onChange, PageChildContainer }) => {
  const [modelSearch, modelSearchSet] = useState('')
  return (
    <PageChildContainer
      {...{
        models: {
          filerModel: linkName,
        },
      }}
    >
      {({ filerModelEntities, filterModelApiActions }) => {
        const modelConfig = RESTIFY_CONFIG.registeredModels[filerModelEntities.modelType]
        const modelTemplate =
          modelConfig.views.selectOption || modelConfig.views.default || `${fieldName}/{${modelConfig.idField}}`

        const searchQuery = modelTemplate.match(/\{([^{}]+)\}/g).reduce((memo, template) => {
          const field = template.slice(1, -1)
          const fieldNameSnake = camelToLowerSnake(field)
          if (modelConfig.meta[field].type === 'string')
            return [...memo, `like(${fieldNameSnake},${encodeURIComponent('*' + modelSearch + '*')})`]
          if (modelConfig.meta[field].type === 'number' && !Number.isNaN(Number(modelSearch)))
            return [...memo, `eq(${fieldNameSnake},${modelSearch})`]
          return memo
        }, [])

        const modelApiConfig = {
          filter: {
            q: modelSearch && searchQuery.length > 0 ? `or(${searchQuery.join(',')})` : '',
            depth: 1,
          },
        }
        const modelArray = filerModelEntities.getArray(modelApiConfig)
        const modelArrayIsLoading = filerModelEntities.getIsLoadingArray(modelApiConfig)
        const modelNextPage = filerModelEntities.getNextPage(modelApiConfig)
        const modelNextPageAction = () => {
          if (modelNextPage) {
            filterModelApiActions.loadNextPage(modelApiConfig)
          }
        }
        return (
          <TSelect
            {...{
              className: basePageLayout.blockFilter,
              label,
              items: modelArray.map((item) => ({
                value: item[modelConfig.idField],
                label: templateApplyValues(modelTemplate, item),
              })),
              onSearch: (value) => modelSearchSet(value ? encodeURIComponent(value) : ''),
              emptyItemsLabel: modelArrayIsLoading ? '' : undefined,
              onScrollToEnd: modelNextPageAction,
              isLoading: modelArrayIsLoading,
              missingValueResolver: (value) => filerModelEntities.getById(value)[modelConfig.idField],
              values: value ? value : [],
              onChange,
              type: SELECT_TYPES.filterDropdown,
              multi: true,
              clearable: true,
              placeHolder: intlObject.intl.formatMessage(messages.all),
            }}
          />
        )
      }}
    </PageChildContainer>
  )
}

export default DropdownFilter
