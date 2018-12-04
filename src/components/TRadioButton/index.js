import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import { INNER_INPUT_TYPES } from '../internal/EnchancedSwitch/constants'
import EnchancedSwitch from '../internal/EnchancedSwitch'

import { RADIO_TYPES, RADIO_BLUE, RADIO_LARGE } from './constants'

import style from './index.css'


class TRadioButton extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.bool,

    type: PropTypes.oneOf(Object.values(RADIO_TYPES)),
  }

  static defaultProps = {
    disabled: false,
    value: false,

    type: RADIO_BLUE,
  }

  render() {
    const {
      disabled,
      value,
      type,

      ...other
    } = this.props

    const radioComp = (
      <div key="radio" className={classNames(style[type], {
        [style.disabled]: disabled,
        [style.checked]: value,
      })}>
        {(type === RADIO_BLUE || type === RADIO_LARGE) && value &&
          <div className={style.innerRoot} />
        }
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

export { RADIO_TYPES } from './constants'

export default TRadioButton
