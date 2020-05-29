import React from 'react'
import TTable from '$trood/components/TTable'
import AsyncEntitiesList from '$trood/components/AsyncEntitiesList'
import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'
import { camelToLowerSnake } from '$trood/helpers/namingNotation'
import SmartDate, { SMART_DATE_FORMATS } from '$trood/components/SmartDate'
import { templateApplyValues } from '$trood/helpers/templates'
import { EntityPageLink } from '$trood/pageManager'
import { RESTIFY_CONFIG } from 'redux-restify'
import { messages } from '../constants'
import localeService, { intlObject } from '$trood/localeService'
import style from './style.css'
import basePageLayout from '$trood/styles/basePageLayout.css'

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
  const fieldList = Object.keys(config.meta).filter((fieldName) => {
    if (exclude.includes(fieldName)) return false
    if (include.length === 0) return true
    return include.includes(fieldName)
  })

  const sort = form.sortColumn ? [`sort(${form.sortOrder > 0 ? '+' : '-'}${form.sortColumn})`] : []

  const filterQuery = filters.reduce((memo, fieldName) => {
    const fieldNameSnake = camelToLowerSnake(fieldName)
    const formField = form[fieldNameSnake]
    if (!formField) return memo

    const field = config.meta[fieldName]
    if (!field) return memo
    if (field.linkType && Array.isArray(formField) && formField.length) {
      return [...memo, `in(${fieldNameSnake},(${formField}))`]
    }

    if (field.type === 'datetime') {
      if (formField.periodType === 'all') return memo
      return [
        ...memo,
        `and(ge(${fieldNameSnake},${encodeURIComponent(formField.startDate)}),le(${fieldNameSnake},${encodeURIComponent(
          formField.endDate,
        )}))`,
      ]
    }

    if (field.type === 'number' && (formField.min || formField.max)) {
      const min = formField.min ? `ge(${fieldNameSnake},${formField.min})` : ''
      const max = formField.max ? `le(${fieldNameSnake},${formField.max})` : ''
      return [...memo, ...(min && max ? [`and(${min},${max})`] : [`${min}${max}`])]
    }
    if (field.type === 'bool' && formField && formField.length) {
      return [...memo, `eq(${fieldNameSnake},${formField})`]
    }
    return memo
  }, [])

  const getSearchQuery = () => {
    if (!search || !form.search) return []
    const searchFields = Array.isArray(search)
      ? search
      : fieldList.filter((fieldName) => ['string', 'number'].includes(config.meta[fieldName].type))
    const searchArray = searchFields.reduce((memo, fieldName) => {
      const fieldNameSnake = camelToLowerSnake(fieldName)

      const fieldType = fieldName.split('.').reduce((memo, nestedFieldName, i) => {
        if (Array.isArray(memo)) return RESTIFY_CONFIG.registeredModels[nestedFieldName]
        if (!memo || !memo.meta || !memo.meta[nestedFieldName]) return null
        const fieldMeta = memo.meta[nestedFieldName]
        if (fieldMeta.linkMetaList) return fieldMeta.linkMetaList
        return fieldMeta.linkMeta ? RESTIFY_CONFIG.registeredModels[fieldMeta.linkMeta] : fieldMeta.type
      }, config)

      if (!fieldType) {
        console.warn(`Search field '${fieldName}' not found`)
        return memo
      }

      if (fieldType === 'string') {
        return [...memo, `like(${fieldNameSnake},${encodeURIComponent('*' + form.search + '*')})`]
      }

      if (fieldType === 'number') {
        const numberSearch = form.search.replace(/[^0-9]/g, '')
        return numberSearch.length > 0 ? [...memo, `eq(${fieldNameSnake},${numberSearch})`] : memo
      }
      console.warn(`Search by field '${fieldNameSnake}' of type '${fieldType}' is not supported`)
      return memo
    }, [])
    return searchArray.length ? [`or(${searchArray.join(',')})`] : []
  }

  const getQuery = () => {
    if (model && /.*\{.*\}.*/.test(query)) {
      return [templateApplyValues(query, model)]
    }
    if (model && childTable) {
      const ids = childTable
        .getChildArray()
        .filter((item) => item.$modelType === tableEntities.modelType)
        .map((item) => item[config.idField])
      const queryArray = []
      if (query) queryArray.push(query)
      if (ids.length) queryArray.push(`in(${config.idField},(${ids.join(',')}))`)
      return queryArray
    }
    return query ? [query] : []
  }

  const tableApiConfig = {
    filter: {
      q: [...sort, ...filterQuery, ...getSearchQuery(), ...getQuery()].join(','),
    },
  }

  const tableArray = tableEntities.getArray(tableApiConfig)
  const tableNextPage = tableEntities.getNextPage(tableApiConfig)
  const tableIsLoading = tableEntities.getIsLoadingArray(tableApiConfig)
  const tableNextPageAction = () => tableApiActions.loadNextPage(tableApiConfig)

  const header = fieldList
    .map((fieldName) => {
      const fieldNameSnake = camelToLowerSnake(fieldName)
      const field = config.meta[fieldName]

      if (field.linkType === 'outer') return null

      return {
        title: intlObject.intl.formatMessage(localeService.entityMessages[tableEntities.modelType][fieldName]),
        name: fieldName,
        sortable: field.type !== 'generic',
        model: (item) => {
          if (fieldNameSnake === config.idField) {
            return <EntityPageLink model={item}>{item[fieldName]}</EntityPageLink>
          }
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
                  date: item[fieldName],
                  format: SMART_DATE_FORMATS.shortWithTime,
                }}
              />
            )
          }
          return item[fieldName]
        },
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
