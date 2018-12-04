import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import EnchancedSwitch from '../internal/EnchancedSwitch'

import style from './index.css'


class TToggle extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.bool,
    isSwitch: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
    value: false,
    isSwitch: true,
  }

  constructor(props) {
    super(props)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  handleMouseUp() {
    if (this.toggle) {
      this.toggle.blur()
    }
  }

  render() {
    const {
      disabled,
      value,
      isSwitch,

      ...other
    } = this.props

    const toggleComp = (
      <div {...{
        key: 'toggle', // For not recreating element and working animations
        className: classNames(style.root, {
          [style.rootChecked]: value,
          [style.rootDisabled]: disabled,
          [style.rootNonSwitch]: !isSwitch,
        }),
        ref: (node) => {
          this.toggle = node
        }, // when we click it bacame focused and gain outline, we should blur it
        tabIndex: 0,
        onMouseUp: this.handleMouseUp,
      }} >
        <span className={style.rootInner}></span>
      </div>
    )

    return (
      <EnchancedSwitch {...{
        disabled,
        switched: value,
        switchedComponent: toggleComp,
        ...other,
      }} />
    )
  }
}

export default TToggle
