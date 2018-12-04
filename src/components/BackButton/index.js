import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { Route } from 'react-router-dom'

import style from './index.css'

import TIcon, { ICONS_TYPES, ROTATE_TYPES } from '$trood/components/TIcon'

import { BACK_BUTTON_TYPES } from './constants'


class BackButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(Object.values(BACK_BUTTON_TYPES)),
    onClick: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    type: BACK_BUTTON_TYPES.button,
  }

  render() {
    const {
      className,
      type,
      onClick,
    } = this.props

    return (
      <Route render={({ history }) => (
        <div {...{
          className: classNames(
            style.root,
            type === BACK_BUTTON_TYPES.floating ? style.floatRoot : style.buttonRoot,
            className,
          ),
          onClick: onClick || history.goBack,
        }} >
          {type === BACK_BUTTON_TYPES.floating &&
            <TIcon {...{
              type: ICONS_TYPES.arrowWithTail,
              size: 40,
              className: style.backArrow,
            }} />
          }

          {type === BACK_BUTTON_TYPES.button &&
            <TIcon {...{
              className: style.icon,
              type: ICONS_TYPES.arrowWithTail,
              rotate: ROTATE_TYPES.bottom,
              label: 'Назад',
              size: 16,
            }} />
          }
        </div>
      )} />
    )
  }
}

export default BackButton
