import React, { useContext } from 'react'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import TCheckbox from '$trood/components/TCheckbox'
import DateTimePicker, { PICKER_TYPES } from '$trood/components/DateTimePicker'
import TSelect, { SELECT_TYPES } from '$trood/components/TSelect'
import modalsStyle from '$trood/styles/modals.css'

export const ModalContext = React.createContext()

const ModalComponentWrapper = type => props => {
  const {
    mask,
    model,
    modelFormActions: { changeField, setFieldError, resetFieldError },
    modelErrors,
  } = useContext(ModalContext)
  const { fieldName } = props
  const onChange = e => changeField(fieldName, e)
  const onInvalid = errs => setFieldError(fieldName, errs)
  const onValid = () => resetFieldError(fieldName)
  const value = model[fieldName]
  const errors = modelErrors[fieldName]
  switch (type) {
    case 'input':
      return (
        <TInput
          {...{
            label: fieldName,
            type: INPUT_TYPES.multi,
            disabled: mask.includes(fieldName),
            className: modalsStyle.control,
            onInvalid: onInvalid,
            onValid: onValid,
            onChange: onChange,
            errors,
            value,
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
            label: fieldName,
            disabled: mask.includes(fieldName),
            className: modalsStyle.control,
            onInvalid: onInvalid,
            onValid: onValid,
            onChange: onChange,
            errors,
            value,
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
            label: fieldName,
            type: PICKER_TYPES.dateTime,
            disabled: mask.includes(fieldName),
            className: modalsStyle.control,
            onInvalid,
            onValid,
            onChange: onChange,
            errors,
            value,
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
            className: modalsStyle.control,
            values: value ? [value] : [],
            onChange: vals => changeField(fieldName, vals[0]),
            disabled: mask.includes(fieldName),
            label: fieldName,
            errors,
            onInvalid,
            onValid,
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
