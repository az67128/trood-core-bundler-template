import React from 'react'
import classNames from 'classnames'

import style from './index.module.css'

import { toTime, fromTime } from 'helpers/format'

import Input, { INPUT_TYPES } from '../../Input'

const TimePicker = ({
  dataAttributes,
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
  <Input {...{
    dataAttributes,
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
