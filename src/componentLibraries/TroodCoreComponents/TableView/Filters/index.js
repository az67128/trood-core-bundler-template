import React from 'react'
import PeriodSelector from '$trood/components/PeriodSelector'
import TButton, { BUTTON_TYPES } from '$trood/components/TButton'
import { camelToLowerSnake, snakeToCamel } from '$trood/helpers/namingNotation'
import DropdownFilter from './DropdownFilter'
import NumberFilter from './NumberFilter'
import BoolFilter from './BoolFilter'
import { getInterval } from '$trood/helpers/dateTime'
import style from './style.css'

const Filters = ({ filters, config, form, formActions, ...restProps }) => {
  const resetFilters = () => {
    const value = {}
    filters.forEach((fieldName) => {
      value[camelToLowerSnake(fieldName)] = null
    })
    formActions.changeSomeFields(value)
  }
  if (!form.isFiltersOpen) return null
  return (
    <div className={style.filterBlock}>
      {filters
        .map((fieldName) => {
          const fieldNameSnake = camelToLowerSnake(fieldName)
          const field = config.meta[fieldName]
          if (!field) {
            console.warn(`Filter field '${fieldName}' is not exists in model`)
            return null
          }
          if (field.type === 'string') return null
          const value = form[fieldNameSnake]
          const onChange = (val) => formActions.changeField(fieldNameSnake, val)
          if (field.linkType) {
            const linkName = snakeToCamel(field.linkMeta)
            const modelEntities = restProps[`${linkName}Entities`]

            if (!modelEntities) {
              console.warn(`Entity model '${linkName}' for filter '${fieldName}' is not provided`)
              return null
            }

            const modelApiActions = restProps[`${linkName}ApiActions`]
            return (
              <DropdownFilter {...{ key: fieldName, value, fieldName, onChange, modelEntities, modelApiActions }} />
            )
          }
          if (field.type === 'datetime') {
            const periodValue = value || {}
            return (
              <PeriodSelector
                {...{
                  key: fieldName,
                  label: fieldName,
                  periodType: periodValue.periodType,
                  startDate: periodValue.startDate,
                  endDate: periodValue.endDate,
                  onSubmit: ({ startDate, endDate, periodType }) =>
                    onChange({
                      startDate,
                      endDate,
                      periodType: periodType || periodValue.periodType,
                      interval: getInterval(startDate, endDate),
                    }),
                }}
              />
            )
          }
          if (field.type === 'number') {
            return <NumberFilter {...{ key: fieldName, value, fieldName, onChange }} />
          }
          if (field.type === 'bool') return <BoolFilter {...{ value, fieldName, onChange }} />
          return (
            <div key={fieldName} className={style.filterItem}>
              {fieldName}-{field.type}
            </div>
          )
        })
        .filter((v) => v)}
      <TButton {...{ className: style.resetButton, label: 'Reset', onClick: resetFilters, type: BUTTON_TYPES.text }} />
    </div>
  )
}

export default Filters
