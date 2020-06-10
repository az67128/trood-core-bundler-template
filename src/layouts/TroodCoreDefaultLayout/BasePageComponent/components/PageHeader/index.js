import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import style from './index.css'

import BackButton from '$trood/components/BackButton'
import Logo from '$trood/components/Logo'
import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'


class PageHeader extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  render() {
    const {
      className,
      layoutProps: {
        layoutConfigFormActions,
      },
    } = this.props

    return (
      <div {...{
        className: classNames(style.root, className),
      }} >
        <BackButton className={style.button} />
        <TIcon {...{
          className: style.pieMenu,
          type: ICONS_TYPES.pieMenu,
          size: 20,
          onClick: () => layoutConfigFormActions.changeField('showMenu', true),
        }} />
        <Link to="/">
          <Logo className={style.logo} />
        </Link>
      </div>
    )
  }
}

export default PageHeader
