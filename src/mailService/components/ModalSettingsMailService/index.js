import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import MenuSettingsMailService from '../MenuSettingsMailService'
import FoldersSettingsMailService from '../FoldersSettingsMailService'
import MailboxesSettingsMailService from '../MailboxesSettingsMailService'
import {
  SETTINGS_FOR,
} from '../../constants'


class ModalSettingsMailService extends PureComponent {
  static propTypes = {
    className: PropTypes.string,

    mailboxes: PropTypes.arrayOf(PropTypes.object),
    mailFormActions: PropTypes.object,
    mailboxesFormActions: PropTypes.object,
    editMailboxesFormErrors: PropTypes.object,
    editMailboxesFormValid: PropTypes.bool,

    folders: PropTypes.arrayOf(PropTypes.object),
    foldersForm: PropTypes.object,
    foldersFormActions: PropTypes.object,
    editFolderFormErrors: PropTypes.object,
    editFolderFormValid: PropTypes.bool,

    settingsMailServiceForm: PropTypes.object,
    settingsMailServiceFormActions: PropTypes.object,
  }

  static defaultProps = {
    className: '',

    mailboxes: [],
    mailFormActions: {},
    mailboxesFormActions: {},

    folders: [],
    foldersForm: {},
    foldersFormActions: {},

    settingsMailServiceForm: {},
    settingsMailServiceFormActions: {},
  }

  render() {
    const {
      className,

      mailboxes,
      editMailboxesForm,
      mailboxesApiActions,
      editMailboxesFormActions,
      editMailboxesFormErrors,
      editMailboxesFormValid,

      folders,
      editFolderForm,
      foldersApiActions,
      editFolderFormActions,
      editFolderFormErrors,
      editFolderFormValid,

      mailServiceActions,

      settingsMailServiceForm,
      settingsMailServiceFormActions,
    } = this.props

    return (
      <div {...{
        className: classNames(style.root, className),
      }} >
        <div className={style.left}>
          <MenuSettingsMailService {...{
            editFolderFormActions,
            editMailboxesFormActions,
            settingsMailServiceForm,
            settingsMailServiceFormActions,
          }} />
        </div>
        <div className={style.right}>
          {settingsMailServiceForm.settingsFor === SETTINGS_FOR.folders &&
            <FoldersSettingsMailService {...{
              folders,
              editFolderForm,
              foldersApiActions,
              editFolderFormActions,
              editFolderFormErrors,
              editFolderFormValid,
              mailServiceActions,
            }} />
          }
          {settingsMailServiceForm.settingsFor === SETTINGS_FOR.mailboxes &&
            <MailboxesSettingsMailService {...{
              mailboxes,
              editMailboxesForm,
              mailboxesApiActions,
              editMailboxesFormActions,
              editMailboxesFormErrors,
              editMailboxesFormValid,
              mailServiceActions,
            }} />
          }
        </div>
      </div>
    )
  }
}

export default ModalSettingsMailService
