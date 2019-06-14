import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import lodashGet from 'lodash/get'

import { forms } from 'redux-restify'

import TClickOutside from '$trood/components/TClickOutside'

import style from './index.css'
import flagIconStyle from '$trood/styles/flagIcon.css'

import systemConfig from '$trood/config'

import { capitalize } from '$trood/helpers/namingNotation'


class LocaleSwitch extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }

    this.toggleOpen = this.toggleOpen.bind(this)
  }

  toggleOpen(value) {
    const open = value === undefined ? !this.state.open : value
    this.setState({ open })
  }

  render() {
    const {
      className,

      localeServiceForm,
      localeServiceFormActions,
    } = this.props

    const { open } = this.state

    const locales = lodashGet(systemConfig, ['services', 'locale', 'availableLocales'])
    if (!locales || locales.length < 2) {
      return null
    }

    const currentLocale = localeServiceForm.selectedLocale

    return (
      <TClickOutside onClick={() => this.toggleOpen(false)}>
        <div {...{
          className: classNames(style.root, className),
        }} >
          {
            !open &&
            <div {...{
              className: style.selectedLocale,
              onClick: () => this.toggleOpen(),
            }}>
              <div {...{
                className: classNames(
                  flagIconStyle.flagIcon,
                  flagIconStyle[`flagIcon${capitalize(currentLocale)}`],
                ),
              }} />
              <div className={style.localeName}>
                {currentLocale}
              </div>
            </div>
          }
          {
            open &&
            <div className={style.localesList}>
              {locales.map(locale => (
                <div {...{
                  key: locale.code,
                  className: classNames(
                    style.localeItem,
                    currentLocale === locale.code && style.currentLocale,
                  ),
                  onClick: () => {
                    this.toggleOpen(false)
                    localeServiceFormActions.changeField('selectedLocale', locale.code)
                  },
                }}>
                  <div {...{
                    className: classNames(
                      flagIconStyle.flagIcon,
                      flagIconStyle[`flagIcon${capitalize(locale.code)}`],
                    ),
                  }} />
                  <div className={style.localeName}>
                    {locale.code}
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </TClickOutside>
    )
  }
}

const mapStateToProps = (state) => ({
  localeServiceForm: forms.selectors.localeServiceForm.getForm(state),
})

const mapDispatchToProps = (dispatch) => ({
  localeServiceFormActions: bindActionCreators(forms.actions.localeServiceForm, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LocaleSwitch)
