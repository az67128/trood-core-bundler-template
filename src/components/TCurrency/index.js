import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import { CURRENCIES_ACCURACY } from './constants'

import { toNumber, toMoney } from '$trood/helpers/format'


class TCurrency extends PureComponent {
  static propTypes = {
    value: (props, propName, componentName) => {
      const currentProp = props[propName]
      if (Number.isNaN(+currentProp)) {
        return new Error(`Invalid prop ${propName} supplied to ${componentName} Expected number or number-like string.`)
      }
      return undefined
    },
    short: PropTypes.bool,
    showSign: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    value: 0,
    short: false,
    showSign: true,
    className: '',
  }

  constructor(props) {
    super(props)

    this.getFormatValue = this.getFormatValue.bind(this)
  }

  getFormatValue() {
    const {
      short,
    } = this.props

    const trimCount = CURRENCIES_ACCURACY.ru
    const value = this.props.value || 0

    if (short) {
      const valueObj = toMoney(value)
      return (
        <span>
          {toNumber(valueObj.value.toString(), trimCount)}
          {valueObj.postfix}
        </span>
      )
    }
    return toNumber(value.toString(), trimCount)
  }

  render() {
    const {
      className,
      showSign,
    } = this.props
    return (
      <span className={classNames(style.root, className)}>
        {this.getFormatValue()}
        {showSign &&
          <span className={style.rub}>p</span>
        }
      </span>
    )
  }
}

export default TCurrency
