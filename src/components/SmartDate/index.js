import React from 'react'
import classNames from 'classnames'
import moment from 'moment'

import style from './index.css'

import {
  FULL_FORMAT,
  SMART_DATE_FORMATS,
  SMART_DATE_FORMATS_FUNCTIONS,
} from './constants'


const UNIX_TIMESTAMP_CHECKER = 1544399
const MS_IN_SEC = 1000

const SmartDate = ({
  className = '',
  date,
  format = FULL_FORMAT,
}) => {
  let realDate = date
  if (typeof realDate === 'number' && realDate / MS_IN_SEC < UNIX_TIMESTAMP_CHECKER) {
    realDate *= MS_IN_SEC
  }
  const dateToDisplay = moment(realDate)
  const defaultDateMsg = 'Неизвестно'
  return (
    <div className={classNames(style.root, className)}>
      {(realDate && dateToDisplay.isValid()) ? SMART_DATE_FORMATS_FUNCTIONS[format](dateToDisplay) : defaultDateMsg}
    </div>
  )
}

export { SMART_DATE_FORMATS }

export default SmartDate
