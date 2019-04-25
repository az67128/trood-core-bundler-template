import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { injectIntl } from 'react-intl'

import style from './index.css'

import {
  intlRenderCallback,
} from '../../constants'


class IntlInjector extends PureComponent {
  static propTypes = {
  }

  static defaultProps = {
  }

  render() {
    const {
      intl,
    } = this.props

    intlRenderCallback(intl)
    return null
  }
}

export default injectIntl(IntlInjector)
