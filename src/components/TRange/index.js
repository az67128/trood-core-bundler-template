import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { DEFAULT_MIN, DEFAULT_MAX, DEFAULT_STEP, DEFAULT_VALUE } from './constants'
import style from './index.css'


class TRange extends PureComponent {
  static defaultProps = {
    onChange: () => {},
    min: DEFAULT_MIN,
    max: DEFAULT_MAX,
    step: DEFAULT_STEP,
    defaultValue: DEFAULT_VALUE,
    className: '',
  }

  static propTypes = {
    onChange: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    defaultValue: PropTypes.number,
    className: PropTypes.string,
  }

  render() {
    const {
      onChange,
      min,
      max,
      step,
      defaultValue,
      className,
    } = this.props

    return (
      <input {...{
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

export default TRange
