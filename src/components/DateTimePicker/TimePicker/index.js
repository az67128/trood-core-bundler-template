import React from 'react'
import classNames from 'classnames'

import style from './index.css'

import { toTime, fromTime } from '$trood/helpers/format'

import TInput, { INPUT_TYPES } from '$trood/components/TInput'

const TimePicker = ({
  value,
  label,
  errors,
  disabled,
  validate,
  className,
  onChange = () => {},
  onValid = () => {},
  onInvalid = () => {},
  onBlur = () => {},
}) => (
  <TInput {...{
    className: classNames(style.root, className),
    disabled,
    type: INPUT_TYPES.time,
    placeholder: '00:00',
    label,
    value: fromTime(value),
    errors,
    onChange: v => onChange(toTime(v)),
    onValid,
    onInvalid,
    onBlur,
    showTextErrors: false,
    validate,
  }} />
)

export default TimePicker
