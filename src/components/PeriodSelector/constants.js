import moment from 'moment'

import { defineMessages } from 'react-intl'

import { DEFAULT_DATE_TIME_FORMAT } from '$trood/mainConstants'


export const PERIOD_ALL = 'all'
export const PERIOD_CURRENT_DAY = 'currentDay'
export const PERIOD_CURRENT_WEEK = 'currentWeek'
export const PERIOD_CURRENT_MONTH = 'currentMonth'
export const PERIOD_CURRENT_YEAR = 'currentYear'
export const PERIOD_CUSTOM = 'custom'


export const DEFAULT_PERIODS = [
  PERIOD_ALL,
  PERIOD_CURRENT_DAY,
  PERIOD_CURRENT_WEEK,
  PERIOD_CURRENT_MONTH,
  PERIOD_CURRENT_YEAR,
  PERIOD_CUSTOM,
]

export const REPORTING_PERIOD_TYPES = {
  [PERIOD_ALL]: PERIOD_ALL,
  [PERIOD_CURRENT_DAY]: PERIOD_CURRENT_DAY,
  [PERIOD_CURRENT_WEEK]: PERIOD_CURRENT_WEEK,
  [PERIOD_CURRENT_MONTH]: PERIOD_CURRENT_MONTH,
  [PERIOD_CURRENT_YEAR]: PERIOD_CURRENT_YEAR,
  [PERIOD_CUSTOM]: PERIOD_CUSTOM,
}

export const REPORTING_PERIOD_TYPES_DICT = defineMessages({
  [PERIOD_ALL]: {
    id: `componentLibraries.LegalCoreComponents.internal.PeriodSelector.${PERIOD_ALL}`,
    defaultMessage: 'All time',
  },
  [PERIOD_CURRENT_DAY]: {
    id: `componentLibraries.LegalCoreComponents.internal.PeriodSelector.${PERIOD_CURRENT_DAY}`,
    defaultMessage: 'Current day',
  },
  [PERIOD_CURRENT_WEEK]: {
    id: `componentLibraries.LegalCoreComponents.internal.PeriodSelector.${PERIOD_CURRENT_WEEK}`,
    defaultMessage: 'Current week',
  },
  [PERIOD_CURRENT_MONTH]: {
    id: `componentLibraries.LegalCoreComponents.internal.PeriodSelector.${PERIOD_CURRENT_MONTH}`,
    defaultMessage: 'Current month',
  },
  [PERIOD_CURRENT_YEAR]: {
    id: `componentLibraries.LegalCoreComponents.internal.PeriodSelector.${PERIOD_CURRENT_YEAR}`,
    defaultMessage: 'Current year',
  },
  [PERIOD_CUSTOM]: {
    id: `componentLibraries.LegalCoreComponents.internal.PeriodSelector.${PERIOD_CUSTOM}`,
    defaultMessage: 'Custom',
  },
})

const periodSelectorFunctions = {
  [PERIOD_ALL]: () => {
    return {
      startDate: moment('1900-01-01').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().add({ year: 1 }).format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
  [PERIOD_CURRENT_DAY]: () => {
    return {
      startDate: moment().startOf('day').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().endOf('day').format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
  [PERIOD_CURRENT_WEEK]: () => {
    return {
      startDate: moment().startOf('week').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().endOf('week').format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
  [PERIOD_CURRENT_MONTH]: () => {
    return {
      startDate: moment().startOf('month').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().endOf('month').format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
  [PERIOD_CURRENT_YEAR]: () => {
    return {
      startDate: moment().startOf('year').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().endOf('year').format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
  [PERIOD_CUSTOM]: () => {
    return {
      startDate: moment().startOf('month').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().endOf('month').format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
}

export const getPeriodSelector = (period) => periodSelectorFunctions[period]()
