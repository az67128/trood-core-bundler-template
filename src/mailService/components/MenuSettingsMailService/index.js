import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'
import { SETTINGS_FOR } from '../../constants'

import TButton, { BUTTON_TYPES, BUTTON_COLORS } from '$trood/components/TButton'


class MenuSettingsMailService extends PureComponent {
  static propTypes = {
    className: PropTypes.string,

    editFolderFormActions: PropTypes.object,
    editMailboxesFormActions: PropTypes.object,
    settingsMailServiceForm: PropTypes.object,
    settingsMailServiceFormActions: PropTypes.object,
  }

  static defaultProps = {
    className: '',

    editFolderFormActions: {},
    editMailboxesFormActions: {},
    settingsMailServiceForm: {},
    settingsMailServiceFormActions: {},
  }

  render() {
    const {
      className,

      editFolderFormActions,
      editMailboxesFormActions,
      settingsMailServiceForm,
      settingsMailServiceFormActions,
    } = this.props
    return (
      <div {...{
        className: classNames(style.root, className),
      }} >
        <TButton {...{
          className: style.buttonSettings,
          color: settingsMailServiceForm.settingsFor === SETTINGS_FOR.mailboxes ?
            BUTTON_COLORS.white : BUTTON_COLORS.gray,
          type: BUTTON_TYPES.text,
          label: 'Настройки почты',
          onClick: () => {
            editMailboxesFormActions.deleteForm()
            settingsMailServiceFormActions.changeField('settingsFor', SETTINGS_FOR.mailboxes)
          },
        }} />
        <TButton {...{
          className: style.buttonSettings,
          color: settingsMailServiceForm.settingsFor === SETTINGS_FOR.folders ?
            BUTTON_COLORS.white : BUTTON_COLORS.gray,
          type: BUTTON_TYPES.text,
          label: 'Настройки папок',
          onClick: () => {
            editFolderFormActions.deleteForm()
            settingsMailServiceFormActions.changeField('settingsFor', SETTINGS_FOR.folders)
          },
        }} />
      </div>
    )
  }
}

export default MenuSettingsMailService
