import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import { HeaderMenu, HEADER_TYPES } from '$trood/pageManager'


class NestedPageMenuComponent extends PureComponent {
  static propTypes = {
  }

  static defaultProps = {
  }

  render() {
    const {
      menuRenderers,
      basePath,
    } = this.props

    if (!menuRenderers || !Object.keys(menuRenderers).length) return null

    return (
      <HeaderMenu {...{
        type: HEADER_TYPES.primary,
        menuRenderers,
        basePath,
      }} />
    )
  }
}

export default NestedPageMenuComponent
