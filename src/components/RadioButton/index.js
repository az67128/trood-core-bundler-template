import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import { INNER_INPUT_TYPES, LABEL_POSITION_TYPES } from '../internal/EnchancedSwitch/constants'
import EnchancedSwitch from '../internal/EnchancedSwitch'

import { RADIO_COLORS, RADIO_SIZES } from './constants'

import style from './index.module.css'

/**
 * Component for output radio button.
 */

class RadioButton extends PureComponent {
  static propTypes = {
    /** disabled or not */
    disabled: PropTypes.bool,
    /** value true or false */
    value: PropTypes.bool,
    /** type is one of RADIO_COLORS.blue, RADIO_COLORS.orange */
    color: PropTypes.oneOf(Object.values(RADIO_COLORS)),
    /** type is one of RADIO_SIZES.normal, RADIO_SIZES.thin, RADIO_SIZES.large */
    size: PropTypes.oneOf(Object.values(RADIO_SIZES)),

    /** class name for styling component */
    className: PropTypes.string,
    /** class name for styling label */
    labelClassName: PropTypes.string,
    /** class name for styling disabled label */
    disabledLabelClassName: PropTypes.string,
    /** stop propagation or not */
    stopPropagation: PropTypes.bool,
    /** view un switched component */
    unSwitchedComponent: PropTypes.node,
    /** label text */
    label: PropTypes.node,
    /** label position is one of LABEL_POSITION_TYPES.right, LABEL_POSITION_TYPES.left */
    labelPosition: PropTypes.oneOf(Object.values(LABEL_POSITION_TYPES)),
    /** second label text */
    secondLabel: PropTypes.node,
    /** second label position is one of LABEL_POSITION_TYPES.right, LABEL_POSITION_TYPES.left */
    secondLabelPosition: PropTypes.oneOf(Object.values(LABEL_POSITION_TYPES)),
    /** errors text */
    errors: PropTypes.arrayOf(PropTypes.node),
    /** show text errors or not */
    showTextErrors: PropTypes.bool,
    /** validate settings */
    validate: PropTypes.shape({
      /** check on blur or not */
      checkOnBlur: PropTypes.bool,
      /** required or not */
      required: PropTypes.bool,
    }),
    /** onChange function */
    onChange: PropTypes.func,
    /** onValid function */
    onValid: PropTypes.func,
    /** onInvalid function */
    onInvalid: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    value: false,

    color: RADIO_COLORS.blue,
    size: RADIO_SIZES.normal,
  }

  render() {
    const {
      disabled,
      value,
      color,
      size,

      ...other
    } = this.props

    const radioComp = (
      <div key="radio" className={classNames(
        style.root,
        style[color],
        style[size],
        disabled && style.disabled,
        value && style.checked,
      )}>
        <div className={style.innerRoot} />
      </div>
    )

    return (
      <EnchancedSwitch {...{
        disabled,
        switched: value,
        switchedComponent: radioComp,
        type: INNER_INPUT_TYPES.radio,
        ...other,
      }} />
    )
  }
}

export { RADIO_COLORS, RADIO_SIZES } from './constants'

export default RadioButton
