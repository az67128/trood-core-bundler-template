import React, { useState } from 'react'
import TSelect, { SELECT_TYPES } from '$trood/components/TSelect'
import { templateApplyValues } from '$trood/helpers/templates'
import { camelToLowerSnake } from '$trood/helpers/namingNotation'
import { RESTIFY_CONFIG } from 'redux-restify'
import { intlObject } from '$trood/localeService'
import { messages } from '../../constants'
import style from '../style.css'

const DropdownFilter = ({ fieldName, label, value, onChange, modelEntities, modelApiActions }) => {
  const [modelSearch, modelSearchSet] = useState('')
  const modelConfig = RESTIFY_CONFIG.registeredModels[modelEntities.modelType]
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
  const modelArray = modelEntities.getArray(modelApiConfig)
  const modelArrayIsLoading = modelEntities.getIsLoadingArray(modelApiConfig)
  const modelNextPage = modelEntities.getNextPage(modelApiConfig)
  const modelNextPageAction = () => {
    if (modelNextPage) {
      modelApiActions.loadNextPage(modelApiConfig)
    }
  }
  return (
    <TSelect
      {...{
        className: style.filterItem,
        label,
        items: modelArray.map((item) => ({
          value: item[modelConfig.idField],
          label: templateApplyValues(modelTemplate, item),
        })),
        onSearch: (value) => modelSearchSet(value ? encodeURIComponent(value) : ''),
        emptyItemsLabel: modelArrayIsLoading ? '' : undefined,
        onScrollToEnd: modelNextPageAction,
        isLoading: modelArrayIsLoading,
        missingValueResolver: (value) => modelEntities.getById(value)[modelConfig.idField],
        values: value ? value : [],
        onChange,
        type: SELECT_TYPES.filterDropdown,
        multi: true,
        clearable: true,
        placeHolder: intlObject.intl.formatMessage(messages.all),
      }}
    />
  )
}

export default DropdownFilter
