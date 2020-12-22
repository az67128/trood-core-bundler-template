import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import useTooltip from '../internal/Tooltip'

import InnerInput from './input'
import {
  VALIDATION_FORMATS,
  INPUT_TYPES,
  formatToFunctions,
  formatFromFunctions,
  formatLengthFunctions,
  includeForTypes,
  excludeForTypes,
  errors,
} from './constants'

/**
 * Component for output input.
 */

class Input extends PureComponent {
  static propTypes = {
    /** type is one of INPUT_TYPES.text, INPUT_TYPES.int, INPUT_TYPES.float, INPUT_TYPES.number,
     * INPUT_TYPES.multi, INPUT_TYPES.wysiwyg, INPUT_TYPES.password, INPUT_TYPES.phone,
     * INPUT_TYPES.phoneWithExt, INPUT_TYPES.money, INPUT_TYPES.moneyNumber, INPUT_TYPES.email,
     * INPUT_TYPES.url, INPUT_TYPES.color, INPUT_TYPES.search, INPUT_TYPES.time */
    type: PropTypes.oneOf(Object.values(INPUT_TYPES)),
    /** input value */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    /** parameters for validation */
    validate: PropTypes.shape({
      /** check on blur or not */
      checkOnBlur: PropTypes.bool,
      /** required field or not */
      required: PropTypes.bool,
      zeroIsValue: PropTypes.bool,
      /** maximum number of characters */
      maxLen: PropTypes.number,
      /** minimum number of characters */
      minLen: PropTypes.number,
      /** format value */
      format: PropTypes.oneOfType([
        PropTypes.instanceOf(RegExp),
        PropTypes.shape({
          regexp: PropTypes.instanceOf(RegExp),
          error: PropTypes.string,
        }),
      ]),
      /** include value */
      include: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.instanceOf(RegExp),
      ]),
      /** exclude value */
      exclude: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.instanceOf(RegExp),
      ]),
    }),

    /** class name for styling component */
    className: PropTypes.string,
    /** class name for styling label */
    labelClassName: PropTypes.string,
    /** class name for styling input */
    inputClassName: PropTypes.string,
    /** text label */
    label: PropTypes.node,
    /** text placeholder */
    placeholder: PropTypes.string,
    /** set auto focus or not */
    autoFocus: PropTypes.bool,
    /** disabled or not */
    disabled: PropTypes.bool,
    /** text errors */
    errors: PropTypes.arrayOf(PropTypes.string),
    /** show text errors or not */
    showTextErrors: PropTypes.bool,
    /** children node */
    children: PropTypes.node,
    /** onChange function */
    onChange: PropTypes.func,
    /** onValid function */
    onValid: PropTypes.func,
    /** onInvalid function */
    onInvalid: PropTypes.func,
    /** onEnter function */
    onEnter: PropTypes.func,
    /** onSearch function */
    onSearch: PropTypes.func,
    /** onFocus function */
    onFocus: PropTypes.func,
    /** onBlur function */
    onBlur: PropTypes.func,

    /** some settings */
    settings: PropTypes.shape({
      /** function to format the value */
      formatValue: PropTypes.func.isRequired,
      /** function to get the value */
      getValue: PropTypes.func.isRequired,
      /** check on blur or not */
      checkOnBlur: PropTypes.bool,
      /** required field or not */
      required: PropTypes.bool,
      /** zero is value or not */
      zeroIsValue: PropTypes.bool,
      /** maximum number of characters */
      maxLen: PropTypes.number,
      /** minimum number of characters */
      minLen: PropTypes.number,
      /** required error text */
      requiredError: PropTypes.string,
      /** format value */
      format: PropTypes.oneOfType([
        PropTypes.instanceOf(RegExp),
        PropTypes.shape({
          regexp: PropTypes.instanceOf(RegExp),
          error: PropTypes.string,
        }),
      ]),
      /** include value */
      include: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.instanceOf(RegExp),
      ]),
      /** exclude value */
      exclude: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.instanceOf(RegExp),
      ]),
    }),
    /** Only for multi, minimum number of rows */
    minRows: PropTypes.number,
    /** Only for multi, maximum number of rows */
    maxRows: PropTypes.number,
  }

  static defaultProps = {
    type: INPUT_TYPES.text,
    validate: {},
  }

  constructor(props) {
    super(props)
    this.getInputSettings = this.getInputSettings.bind(this)
  }

  getInputSettings() {
    const { type, value, validate } = this.props
    const properties = {
      ...validate,
      formatValue: formatToFunctions[type] || (v => v),
      getValue: formatFromFunctions[type] || (v => v),
      minLen: validate.minLen || (formatLengthFunctions[type] || (() => 0))(value),
      include: validate.include || includeForTypes[type],
      exclude: validate.exclude || excludeForTypes[type],
    }

    if (!properties.format) {
      const validateRegexp = VALIDATION_FORMATS[type]
      if (validateRegexp) {
        properties.format = {
          regexp: validateRegexp,
          error: errors[type],
        }
      }
    }

    return properties
  }

  render() {
    return (
      <InnerInput {...{
        ...this.props,
        validate: undefined,
        settings: this.getInputSettings(),
      }} />
    )
  }
}

export { INPUT_TYPES } from './constants'

export default useTooltip(Input)
