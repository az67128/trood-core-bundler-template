import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import lodashGet from 'lodash/get'

import { forms } from 'redux-restify'

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

  render() {
    const {
      className,

      localeServiceForm,
      localeServiceFormActions,
    } = this.props

    const locales = lodashGet(systemConfig, ['services', 'locale', 'availableLocales'])
    if (!locales || !locales.length) {
      return null
    }

    return (
      <div {...{
        className: classNames(style.root, className),
      }} >
        {locales.map(locale => (
          <div {...{
            key: locale.code,
            className: classNames(
              flagIconStyle.flagIcon,
              style.flag,
              localeServiceForm.selectedLocale === locale.code && style.selectedFlag,
              flagIconStyle[`flagIcon${capitalize(locale.code)}`],
            ),
            onClick: () => {
              localeServiceFormActions.changeField('selectedLocale', locale.code)
            },
          }} />
        ))}
      </div>
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
