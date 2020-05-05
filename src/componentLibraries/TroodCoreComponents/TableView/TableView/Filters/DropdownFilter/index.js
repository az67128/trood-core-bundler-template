import React, { useState } from 'react'
import TSelect, { SELECT_TYPES } from '$trood/components/TSelect'
import { templateApplyValues } from '$trood/helpers/templates'
import { RESTIFY_CONFIG } from 'redux-restify'
import style from '../style.css'

const DropdownFilter = ({ fieldName, value, onChange, modelEntities, modelApiActions }) => {
  const [modelSearch, modelSearchSet] = useState('')
  const modelConfig = RESTIFY_CONFIG.registeredModels[modelEntities.modelType]
  const modelTemplate =
    modelConfig.views.selectOption || modelConfig.views.default || `${fieldName}/{${modelConfig.idField}}`
  const modelApiConfig = {
    filter: {
      q: modelSearch ? `eq(${modelConfig.idField},${modelSearch})` : '',
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
        label: fieldName,
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
        placeHolder: 'All',
      }}
    />
  )
}

export default DropdownFilter
