import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { Route } from 'react-router-dom'
import { defineMessages } from 'react-intl'

import { intlObject } from '$trood/localeService'

import style from './index.css'

import TIcon, { ICONS_TYPES, ROTATE_TYPES } from '$trood/components/TIcon'

import { BACK_BUTTON_TYPES } from './constants'


const messages = defineMessages({
  back: {
    id: 'components.BackButton.back',
    defaultMessage: 'Back',
  },
})

class BackButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(Object.values(BACK_BUTTON_TYPES)),
    onClick: PropTypes.func,
    withLabel: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    type: BACK_BUTTON_TYPES.button,
    withLabel: true,
  }

  render() {
    const {
      className,
      type,
      onClick,
      withLabel,
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
              label: withLabel ? intlObject.intl.formatMessage(messages.back) : undefined,
              size: 16,
            }} />
          }
        </div>
      )} />
    )
  }
}

export default BackButton
