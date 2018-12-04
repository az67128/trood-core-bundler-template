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
