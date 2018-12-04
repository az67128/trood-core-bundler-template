import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classNames from 'classnames'

import style from './index.css'

import { ICONS_TYPES } from '$trood/components/TIcon/constants'

import systemConfig from '$trood/config'

import { HeaderMenu, HEADER_TYPES, getPagesHeaderRenderers } from '$trood/pageManager'


const menuRenderers = getPagesHeaderRenderers(systemConfig.pages)

class Header extends Component {
  static propTypes = {
    className: PropTypes.string,

    authActions: PropTypes.object,
  }

  static defaultProps = {
    className: '',

    authActions: {},
  }

  render() {
    const {
      className,

      authActions,
    } = this.props

    return (
      <div {...{
        className: classNames(style.root, className),
      }} >
        <HeaderMenu {...{
          type: HEADER_TYPES.vertical,
          menuRenderers,
          additionalLinks: [
            {
              label: 'Выйти',
              onClick: authActions.logout,
              iconType: ICONS_TYPES.logout,
              className: style.logot,
            },
          ],
        }} />
      </div>
    )
  }
}

export default Header
