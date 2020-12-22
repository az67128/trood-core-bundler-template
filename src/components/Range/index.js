import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import useTooltip from '../internal/Tooltip'

import { DEFAULT_MIN, DEFAULT_MAX, DEFAULT_STEP, DEFAULT_VALUE } from './constants'
import style from './index.module.css'

/**
 * Component for output Range.
 */

class Range extends PureComponent {
  static propTypes = {
    /** class name for styling component */
    className: PropTypes.string,
    /** minimum range value */
    min: PropTypes.number,
    /** maximum range value */
    max: PropTypes.number,
    /** value change step */
    step: PropTypes.number,
    /** default value */
    defaultValue: PropTypes.number,
    /** onChange function */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: () => {},
    min: DEFAULT_MIN,
    max: DEFAULT_MAX,
    step: DEFAULT_STEP,
    defaultValue: DEFAULT_VALUE,
    className: '',
  }

  render() {
    const {
      dataAttributes,
      onChange,
      min,
      max,
      step,
      defaultValue,
      className,
    } = this.props

    return (
      <input {...{
        ...dataAttributes,
        className: `${style.root} ${className}`,
        type: 'range',
        'data-cy': 'input_range',
        onChange: e => onChange(e.target.value),
        min,
        max,
        step,
        defaultValue,
      }} />
    )
  }
}

export default useTooltip(Range)
