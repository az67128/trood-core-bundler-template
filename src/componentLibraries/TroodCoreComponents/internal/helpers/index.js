import { camelToLowerSnake } from '$trood/helpers/namingNotation'
import { RESTIFY_CONFIG } from 'redux-restify'
import { templateApplyValues } from '$trood/helpers/templates'

export function filterFields({ meta, include, exclude }) {
  return Object.keys(meta).filter((fieldName) => {
    if (exclude.includes(fieldName)) return false
    if (include.length === 0) return true
    return include.includes(fieldName)
  })
}

export function getFilterQuery({ filters, form, config }) {
  return filters.reduce((memo, fieldName) => {
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
}

export function getSearchQuery({ search, form, fieldList, config }) {
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

export function getQuery({model, childTable, query, childIds, config}){
  if (model && /.*\{.*\}.*/.test(query)) {
    return [templateApplyValues(query, model)]
  }
  if (model && childTable && childIds) {
    const queryArray = []
    if (query) queryArray.push(query)
    if (childIds.length) queryArray.push(`in(${config.idField},(${childIds.join(',')}))`)
    return queryArray
  }
  return query ? [query] : []
}