import React, { useContext } from 'react'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import TCheckbox from '$trood/components/TCheckbox'
import DateTimePicker, { PICKER_TYPES } from '$trood/components/DateTimePicker'
import TSelect, { SELECT_TYPES } from '$trood/components/TSelect'
import modalsStyle from '$trood/styles/modals.css'

import { getNestedObjectField } from '$trood/helpers/nestedObjects'

export const ModalContext = React.createContext()

const validateInput  = {
  required: true,
  checkOnBlur: true,
}
const validateDateTime = {
  checkOnBlur: true,
  requiredDate: false,
  requiredTime: false,
}

const ModalComponentWrapper = type => props => {
  const {
    editMask,
    getMask,
    model,
    modelFormActions: { changeField, setFieldError, resetFieldError },
    modelErrors,
  } = useContext(ModalContext)
  const { fieldName } = props
  const nestedObjectField = getNestedObjectField(fieldName);
  if (getMask.includes(Array.isArray(fieldName) ? fieldName[0] : fieldName)) return null

  const onChange = e => changeField(nestedObjectField, e)
  const onInvalid = errs => setFieldError(nestedObjectField, errs)
  const onValid = () => resetFieldError(nestedObjectField)
  const value = model[nestedObjectField]
  const errors = modelErrors[nestedObjectField]

  const commonProps = {
    label: fieldName,
    disabled: editMask.includes(Array.isArray(fieldName) ? fieldName[0] : fieldName),
    className: modalsStyle.control,
    errors,
    onInvalid,
    onValid,
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
            validate: validateInput,
            ...props,
          }}
        />
      )
    case 'checkbox':
      return (
        <TCheckbox
          {...{
            ...commonProps,
            validate: validateInput,
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
            validate: validateDateTime,
            ...props,
          }}
        />
      )
    case 'select':
      return (
        <TSelect
          {...{
            ...commonProps,
            values: props.multi ? value : (value ? [value] : []),
            onChange: vals => onChange(props.multi ? vals : vals[0]),
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

TCheckbox.whyDidYouRender = true;