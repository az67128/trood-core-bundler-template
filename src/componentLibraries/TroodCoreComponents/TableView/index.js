import React, { useState } from 'react'
import TTable from '$trood/components/TTable'
import AsyncEntitiesList from '$trood/components/AsyncEntitiesList'
import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'
import { snakeToCamel } from '$trood/helpers/namingNotation'
import basePageLayout from '$trood/styles/basePageLayout.css'
import SmartDate, { SMART_DATE_FORMATS } from '$trood/components/SmartDate'
import { templateApplyValues } from '$trood/helpers/templates'
import { RESTIFY_CONFIG } from 'redux-restify'
import { EntityPageLink } from '$trood/pageManager'
import style from './style.css'

const TableView = ({
  tableEntities,
  tableApiActions,
  tableEditorActions = {},
  checking = false,
  editable = false,
  include = [],
  exclude = [],
}) => {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)

  const config = RESTIFY_CONFIG.registeredModels[tableEntities.modelType]

  const sort = sortColumn ? `sort(${sortOrder > 0 ? '+' : '-'}${sortColumn})` : ''
  const tableApiConfig = {
    filter: {
      depth: 3,
      q: sort,
    },
  }
  const tableArray = tableEntities.getArray(tableApiConfig)
  const tableNextPage = tableEntities.getNextPage(tableApiConfig)
  const tableIsLoading = tableEntities.getIsLoadingArray(tableApiConfig)
  const tableNextPageAction = () => tableApiActions.loadNextPage(tableApiConfig)
  const header = Object.keys(config.meta)
    .filter((key) => {
      if (exclude.includes(key)) return false
      if (include.length === 0) return true
      return include.includes(key)
    })
    .map((key) => {
      const fieldName = snakeToCamel(key)
      const field = config.meta[key]
      if (field.linkType === 'outer') return null
      return {
        title: key.replace(/_/g, ' '),
        name: key,
        sortable: field.type !== 'generic',
        model: (item) => {
          if (field.linkType) {
            if (!item[fieldName]) return null
            if (field.type === 'objects') {
              if (!item[fieldName].length) return null
              return item[fieldName].map((item2) => {
                const { name, idField, views } = RESTIFY_CONFIG.registeredModels[item2.$modelType]
                const template = views.tableCell || views.default || `${name}/{${idField}}`
                return (
                  <EntityPageLink key={item2[idField]} model={item2}>
                    {templateApplyValues(template, item2)}
                  </EntityPageLink>
                )
              })
            }
            const { name, idField, views } = RESTIFY_CONFIG.registeredModels[item[fieldName].$modelType]
            const template = views.tableCell || views.default || `${name}/{${idField}}`

            return (
              <EntityPageLink model={item[fieldName]}>{templateApplyValues(template, item[fieldName])}</EntityPageLink>
            )
          }
          if (field.type === 'bool') {
            return item[fieldName] ? 'true' : 'false'
          }
          if (field.type === 'datetime') {
            return (
              <SmartDate
                {...{
                  date: item[field.name],
                  format: SMART_DATE_FORMATS.shortWithTime,
                }}
              />
            )
          }
          if (config.idField === key) {
            return <EntityPageLink model={item[fieldName]}>{item[key]}</EntityPageLink>
          }
          return item[key]
        },
      }
    })
    .filter((v) => v)

  const editColumn = [
    {
      title: 'Edit',
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

  return (
    <div className={basePageLayout.block}>
      <AsyncEntitiesList
        {...{
          nextPage: tableNextPage,
          isLoading: tableIsLoading,
          nextPageAction: tableNextPageAction,
        }}
      >
        <TTable
          {...{
            rowKey: (item) => `${item.$modelType}_${item[config.idField]}`,
            sortingColumn: sortColumn,
            sortingOrder: sortOrder,
            onSort: (name, order) => {
              setSortColumn(name)
              setSortOrder(order)
            },
            body: tableArray,
            header: [...header, ...(editable ? editColumn : [])],
            checking,
          }}
        />
      </AsyncEntitiesList>
    </div>
  )
}

export default TableView
