import React from 'react'
import TTable from '$trood/components/TTable'
import AsyncEntitiesList from '$trood/components/AsyncEntitiesList'
import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'
import { templateApplyValues } from '$trood/helpers/templates'
import { EntityPageLink } from '$trood/pageManager'
import { messages } from '../constants'
import localeService, { intlObject } from '$trood/localeService'
import style from './style.css'
import basePageLayout from '$trood/styles/basePageLayout.css'
import {
  filterFields,
  getFilterQuery,
  getSearchQuery,
} from '$trood/componentLibraries/TroodCoreComponents/internal/helpers'
import getDataComponent from '$trood/componentLibraries/TroodCoreComponents/internal/helpers/getDataComponent'

const Table = ({
  config,
  tableEntities,
  tableApiActions,
  tableEditorActions,
  checking,
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

  const tableApiConfig = {
    filter: {
      q: [...sort, ...filterQuery, ...searchQuery, ...getQuery()].join(','),
    },
  }

  const tableArray = tableEntities.getArray(tableApiConfig)
  const tableNextPage = tableEntities.getNextPage(tableApiConfig)
  const tableIsLoading = tableEntities.getIsLoadingArray(tableApiConfig)
  const tableNextPageAction = () => tableApiActions.loadNextPage(tableApiConfig)

  const header = fieldList
    .map((fieldName) => {
      const field = config.meta[fieldName]

      if (field.linkType === 'outer') return null

      return {
        title: intlObject.intl.formatMessage(localeService.entityMessages[tableEntities.modelType][fieldName]),
        name: fieldName,
        sortable: field.type !== 'generic',
        model: (item) => getDataComponent({ config, item, fieldName }),
      }
    })
    .filter((v) => v)

  const editColumn = [
    {
      title: intlObject.intl.formatMessage(messages.edit),
      model: (item) => (
        <TIcon
          {...{
            size: 18,
            type: ICONS_TYPES.edit,
            className: style.editIcon,
            onClick: () => tableEditorActions.editEntity(item),
          }}
        />
      ),
    },
  ]

  const viewColumns = [
    {
      title: intlObject.intl.formatMessage(localeService.entityMessages[tableEntities.modelType]._objectView),
      model: (item) => {
        const template =
          config.views.tableCell || config.views.default || `${tableEntities.modelType}/{${config.idField}}`
        return <EntityPageLink model={item}>{templateApplyValues(template, item)}</EntityPageLink>
      },
    },
  ]

  return (
    <AsyncEntitiesList
      {...{
        className: basePageLayout.blockContentThin,
        nextPage: tableNextPage,
        isLoading: tableIsLoading,
        nextPageAction: tableNextPageAction,
      }}
    >
      <TTable
        {...{
          rowKey: (item) => `${item.$modelType}_${item[config.idField]}`,
          sortingColumn: form.sortColumn,
          sortingOrder: form.sortOrder,
          onSort: (name, order) => {
            formActions.changeSomeFields({
              sortColumn: name,
              sortOrder: order,
            })
          },
          body: tableArray,
          header: [...(hideView ? [] : viewColumns), ...header, ...(editable ? editColumn : [])],
          checking,
        }}
      />
    </AsyncEntitiesList>
  )
}

export default Table
