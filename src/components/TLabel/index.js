import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'


class TLabel extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    required: PropTypes.bool,
    label: PropTypes.node,
  }

  static defaultProps = {
    className: '',
    required: false,
  }

  render() {
    const {
      className,
      required,
      label,
    } = this.props

    return (
      <span className={classNames(style.root, className)}>
        {label}{required && ' *'}
      </span>
    )
  }
}

export default TLabel
