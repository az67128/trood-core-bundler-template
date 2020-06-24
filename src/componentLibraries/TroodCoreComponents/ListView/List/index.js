import React from 'react'
import AsyncEntitiesList from '$trood/components/AsyncEntitiesList'
import style from './style.css'
import Card from './Card'
import SubList from './SubList'
import basePageLayout from '$trood/styles/basePageLayout.css'
import {
  filterFields,
  getFilterQuery,
  getSearchQuery,
  getQuery,
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
  filters,
  search,
  query,
  hideView,
  model,
  childList,
  PageChildContainer,
  sublist,
}) => {
  const childIds = model && childList ? childList.getChildArray().map((item) => item[config.idField]) : null
  const fieldList = filterFields({ meta: config.meta, exclude, include })
  const sort = form.sortColumn ? [`sort(${form.sortOrder > 0 ? '+' : '-'}${form.sortColumn})`] : []
  const filterQuery = getFilterQuery({ filters, form, config })
  const searchQuery = getSearchQuery({ search, form, fieldList, config })
  const generalQuery = getQuery({ model, childTable: childList, query, childIds, config })

  const listApiConfig = {
    filter: {
      q: [...sort, ...filterQuery, ...searchQuery, ...generalQuery].join(','),
    },
  }
  let listArray = listEntities.getArray(listApiConfig)
  let listNextPage = listEntities.getNextPage(listApiConfig)
  let listIsLoading = listEntities.getIsLoadingArray(listApiConfig)
  const listNextPageAction = () => listApiActions.loadNextPage(listApiConfig)

  if (childIds && childIds.length === 0) {
    listArray = []
    listNextPage = null
    listIsLoading = false
  }

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
          <Card
            {...{ item, fieldList, config, modelType: listEntities.modelType, hideView, listEditorActions, editable }}
          />
          {sublist && sublist.model ? <SubList {...{ sublist, PageChildContainer, item }} /> : null}
        </div>
      ))}
    </AsyncEntitiesList>
  )
}

export default List
