import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { intlObject } from '$trood/localeService'

import Input from './input'
import {
  VALIDATION_FORMATS,
  INPUT_TYPES,
  formatToFunctions,
  formatFromFunctions,
  formatLengthFunctions,
  includeForTypes,
  excludeForTypes,
  messages,
} from './constants'

class TInput extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(Object.values(INPUT_TYPES)),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    validate: PropTypes.shape({
      checkOnBlur: PropTypes.bool,
      required: PropTypes.bool,
      maxLen: PropTypes.number,
      minLen: PropTypes.number,
      format: PropTypes.oneOfType([
        PropTypes.instanceOf(RegExp),
        PropTypes.shape({
          regexp: PropTypes.instanceOf(RegExp),
          error: PropTypes.string,
        }),
      ]),
      include: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.instanceOf(RegExp),
      ]),
      exclude: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.instanceOf(RegExp),
      ]),
    }),
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
      const errorMsg = messages[type]
      if (validateRegexp) {
        properties.format = {
          regexp: validateRegexp,
          error: errorMsg && intlObject.intl.formatMessage(errorMsg),
        }
      }
    }

    return properties
  }

  render() {
    return (
      <Input {...{
        ...this.props,
        validate: undefined,
        settings: this.getInputSettings(),
      }} />
    )
  }
}

export { INPUT_TYPES } from './constants'

export default TInput
