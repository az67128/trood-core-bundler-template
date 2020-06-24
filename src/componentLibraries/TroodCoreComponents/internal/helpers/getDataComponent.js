import React from 'react'
import { camelToLowerSnake } from '$trood/helpers/namingNotation'
import { RESTIFY_CONFIG } from 'redux-restify'
import { EntityPageLink } from '$trood/pageManager'
import { templateApplyValues } from '$trood/helpers/templates'
import SmartDate, { SMART_DATE_FORMATS } from '$trood/components/SmartDate'

const getDataComponent = ({ fieldName, config, item }) => {
  const fieldNameSnake = camelToLowerSnake(fieldName)
  const field = config.meta[fieldName]
  if (field.linkType === 'outer') return null

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
    // TODO fix sub item $modelConfig
    if (!item[fieldName].$modelType) return null
    const { name, idField, views } = RESTIFY_CONFIG.registeredModels[item[fieldName].$modelType]
    const template = views.tableCell || views.default || `${name}/{${idField}}`
    return <EntityPageLink model={item[fieldName]}>{templateApplyValues(template, item[fieldName])}</EntityPageLink>
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
}

export default getDataComponent
