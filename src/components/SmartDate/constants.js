import moment from 'moment'
import { defineMessages } from 'react-intl'
import { intlObject } from '$trood/localeService'


const messages = defineMessages({
  today: {
    id: 'components.SmartDate.today',
    defaultMessage: 'today',
  },
  tomorrow: {
    id: 'components.SmartDate.tomorrow',
    defaultMessage: 'tomorrow',
  },
  yesterday: {
    id: 'components.SmartDate.yesterday',
    defaultMessage: 'yesterday',
  },
})

export const FULL_FORMAT_WITH_TIME = 'fullWithTime'
export const ONLY_TIME = 'onlyTime'
export const FULL_FORMAT = 'full'
export const SHORT_FORMAT = 'short'
export const SHORT_WITH_TIME_FORMAT = 'shortWithTime'
export const NO_SAME_YEAR_FULL_FORMAT = 'noSameYearFull'
export const NO_SAME_YEAR_SHORT_FORMAT = 'noSameYearShort'
export const RELATIVE_FULL_FORMAT = 'relativeFull'
export const RELATIVE_FULL_WITH_TIME_FORMAT = 'relativeFullWithTime'
export const RELATIVE_SHORT_FORMAT = 'relativeShort'
export const RELATIVE_SHORT_WITH_TIME_FORMAT = 'relativeShortWithTime'
export const WITHOUT_DAY = 'withoutDay'

export const SMART_DATE_FORMATS = {
  [FULL_FORMAT_WITH_TIME]: FULL_FORMAT_WITH_TIME,
  [ONLY_TIME]: ONLY_TIME,
  [FULL_FORMAT]: FULL_FORMAT,
  [SHORT_FORMAT]: SHORT_FORMAT,
  [SHORT_WITH_TIME_FORMAT]: SHORT_WITH_TIME_FORMAT,
  [NO_SAME_YEAR_FULL_FORMAT]: NO_SAME_YEAR_FULL_FORMAT,
  [NO_SAME_YEAR_SHORT_FORMAT]: NO_SAME_YEAR_SHORT_FORMAT,
  [RELATIVE_FULL_FORMAT]: RELATIVE_FULL_FORMAT,
  [RELATIVE_SHORT_FORMAT]: RELATIVE_SHORT_FORMAT,
  [RELATIVE_FULL_WITH_TIME_FORMAT]: RELATIVE_FULL_WITH_TIME_FORMAT,
  [RELATIVE_SHORT_WITH_TIME_FORMAT]: RELATIVE_SHORT_WITH_TIME_FORMAT,
  [WITHOUT_DAY]: WITHOUT_DAY,
}

const fullDate = {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
}

const dig2Date = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
}

const shortDate = {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
}

const timeFormat = {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
}

const relativeDate = (value, full, time) => {
  const timeStr = time ? intlObject.intl.formatDate(value, time) : ''
  switch (moment(value).startOf('day').diff(moment().startOf('day'), 'days')) {
    case 0: return `${intlObject.intl.formatMessage(messages.today)} ${timeStr}`.trim()
    case 1: return `${intlObject.intl.formatMessage(messages.tomorrow)} ${timeStr}`.trim()
    case -1: return `${intlObject.intl.formatMessage(messages.yesterday)} ${timeStr}`.trim()
    default: return intlObject.intl.formatDate(value, {
      ...time,
      ...(full ? fullDate : dig2Date),
    })
  }
}

export const SMART_DATE_FORMATS_FUNCTIONS = {
  [FULL_FORMAT_WITH_TIME]: value => intlObject.intl.formatDate(value, {
    ...fullDate,
    ...timeFormat,
  }),
  [FULL_FORMAT]: value => intlObject.intl.formatDate(value, fullDate),
  [SHORT_FORMAT]: value => intlObject.intl.formatDate(value, dig2Date),
  [SHORT_WITH_TIME_FORMAT]: value => intlObject.intl.formatDate(value, {
    ...dig2Date,
    ...timeFormat,
  }),
  [ONLY_TIME]: value => intlObject.intl.formatDate(value, timeFormat),
  [NO_SAME_YEAR_FULL_FORMAT]: value => {
    if (moment().isSame(value, 'year')) return intlObject.intl.formatDate(value, { ...fullDate, year: undefined })
    return intlObject.intl.formatDate(value, fullDate)
  },
  [NO_SAME_YEAR_SHORT_FORMAT]: value => {
    if (moment().isSame(value, 'year')) return intlObject.intl.formatDate(value, { ...fullDate, year: undefined })
    return intlObject.intl.formatDate(value, dig2Date)
  },
  [RELATIVE_FULL_FORMAT]: value => relativeDate(value, true),
  [RELATIVE_SHORT_FORMAT]: value => relativeDate(value, false),
  [RELATIVE_FULL_WITH_TIME_FORMAT]: value => relativeDate(value, true, timeFormat),
  [RELATIVE_SHORT_WITH_TIME_FORMAT]: value => relativeDate(value, false, timeFormat),
  [WITHOUT_DAY]: value => intlObject.intl.formatDate(value, { ...shortDate, day: undefined }),
}
