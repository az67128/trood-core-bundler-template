import moment from 'moment'


export const compareDates = (a, b) => {
  if (a === undefined || a === null) return -1
  if (b === undefined || b === null) return 1
  const dateA = moment(a)
  const dateB = moment(b)
  if (dateA.isAfter(dateB)) return -1
  if (dateA.isBefore(dateB)) return 1
  return 0
}

export const nextYear = () => {
  return (moment().year() + 1).toString()
}

const INTERVAL_DAY = 'day'
const INTERVAL_WEEK = 'week'
const INTERVAL_MONTH = 'month'
const INTERVAL_YEAR = 'year'

const INTERVALS = {
  [INTERVAL_DAY]: (from, to) => moment(to).diff(from, 'week', true) <= 1,
  [INTERVAL_WEEK]: (from, to) => moment(to).diff(from, 'month', true) < 2,
  [INTERVAL_MONTH]: (from, to) => moment(to).diff(from, 'year', true) < 1,
  [INTERVAL_YEAR]: (from, to) => moment(to).diff(from, 'year', true) >= 1,
}

export const getInterval = (from, to) => {
  return Object.keys(INTERVALS).find(interval => INTERVALS[interval](from, to))
}
