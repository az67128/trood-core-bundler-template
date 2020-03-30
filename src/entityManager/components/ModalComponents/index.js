import React, { useContext } from 'react'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import TCheckbox from '$trood/components/TCheckbox'
import DateTimePicker, { PICKER_TYPES } from '$trood/components/DateTimePicker'
import TSelect, { SELECT_TYPES } from '$trood/components/TSelect'
import modalsStyle from '$trood/styles/modals.css'
import { snakeToCamel } from '$trood/helpers/namingNotation'

export const ModalContext = React.createContext()

const ModalComponentWrapper = type => props => {
  const {
    editMask,
    getMask,
    model,
    modelFormActions: { changeField, setFieldError, resetFieldError },
    modelErrors,
  } = useContext(ModalContext)
  const { fieldName } = props

  const fieldNameCamelized = snakeToCamel(fieldName)
  if (getMask.includes(fieldNameCamelized)) return null

  const onChange = e => changeField(fieldNameCamelized, e)
  const onInvalid = errs => setFieldError(fieldNameCamelized, errs)
  const onValid = () => resetFieldError(fieldNameCamelized)
  const value = model[fieldNameCamelized]
  const errors = modelErrors[fieldNameCamelized]

  const commonProps = {
    label: fieldNameCamelized,
    disabled: editMask.includes(fieldNameCamelized),
    className: modalsStyle.control,
    errors,
    onInvalid: onInvalid,
    onValid: onValid,
    onChange,
    value,
  }
  switch (type) {
    case 'input':
      return (
        <TInput
          {...{
            ...commonProps,
            type: INPUT_TYPES.multi,
            validate: {
              required: true,
              checkOnBlur: true,
            },
            ...props,
          }}
        />
      )
    case 'checkbox':
      return (
        <TCheckbox
          {...{
            ...commonProps,
            validate: {
              required: true,
              checkOnBlur: true,
            },
            ...props,
          }}
        />
      )
    case 'datetimepicker':
      return (
        <DateTimePicker
          {...{
            ...commonProps,
            type: PICKER_TYPES.dateTime,
            validate: {
              checkOnBlur: true,
              requiredDate: false,
              requiredTime: false,
            },
            ...props,
          }}
        />
      )
    case 'select':
      return (
        <TSelect
          {...{
            ...commonProps,
            values: value ? [value] : [],
            onChange: vals => changeField(fieldNameCamelized, vals[0]),
            type: SELECT_TYPES.filterDropdown,
            multi: false,
            clearable: true,
            placeHolder: 'Not set',
            ...props,
          }}
        />
      )
    default:
      null
  }
}

export const ModalComponents = {
  ModalInput: ModalComponentWrapper('input'),
  ModalCheckbox: ModalComponentWrapper('checkbox'),
  ModalDateTimePicker: ModalComponentWrapper('datetimepicker'),
  ModalSelect: ModalComponentWrapper('select'),
}
