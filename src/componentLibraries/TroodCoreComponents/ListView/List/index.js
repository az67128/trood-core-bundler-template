import React from 'react'
import AsyncEntitiesList from '$trood/components/AsyncEntitiesList'
import { templateApplyValues } from '$trood/helpers/templates'
import style from './style.css'
import Card from './Card'
import basePageLayout from '$trood/styles/basePageLayout.css'
import {
  filterFields,
  getFilterQuery,
  getSearchQuery,
} from '$trood/componentLibraries/TroodCoreComponents/internal/helpers'

const List = ({
  config,
  listEntities,
  listApiActions,
  listEditorActions,
  editable,
  include,
  exclude,
  form,
  formActions,
  filters,
  search,
  query,
  hideView,
  model,
  childTable,
}) => {
  const fieldList = filterFields({ meta: config.meta, exclude, include })

  const sort = form.sortColumn ? [`sort(${form.sortOrder > 0 ? '+' : '-'}${form.sortColumn})`] : []
  const filterQuery = getFilterQuery({ filters, form, config })

  const searchQuery = getSearchQuery({ search, form, fieldList, config })

  const getQuery = () => {
    if (model && /.*\{.*\}.*/.test(query)) {
      return [templateApplyValues(query, model)]
    }
    if (model && childTable) {
      const ids = childTable.getChildArray().map((item) => item[config.idField])
      const queryArray = []
      if (query) queryArray.push(query)
      if (ids.length) queryArray.push(`in(${config.idField},(${ids.join(',')}))`)
      return queryArray
    }
    return query ? [query] : []
  }

  const listApiConfig = {
    filter: {
      q: [...sort, ...filterQuery, ...searchQuery, ...getQuery()].join(','),
    },
  }

  const listArray = listEntities.getArray(listApiConfig)
  const listNextPage = listEntities.getNextPage(listApiConfig)
  const listIsLoading = listEntities.getIsLoadingArray(listApiConfig)
  const listNextPageAction = () => listApiActions.loadNextPage(listApiConfig)
  return (
    <AsyncEntitiesList
      {...{
        className: basePageLayout.blockContentThin,
        nextPage: listNextPage,
        isLoading: listIsLoading,
        nextPageAction: listNextPageAction,
      }}
    >
      {listArray.map((item) => (
        <div className={style.cardItem} key={item[config.idField]}>
          <Card {...{ item, fieldList, config, listEntities, hideView, listEditorActions, editable }} />
        </div>
      ))}
    </AsyncEntitiesList>
  )
}

export default List
