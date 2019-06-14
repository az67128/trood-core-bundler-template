import { bindActionCreators } from 'redux'

import { registerModal, MODAL_SIZES } from '$trood/modals'

import { api, forms } from 'redux-restify'

import { intlObject } from '$trood/localeService'

import { SETTINGS_MAIL_MODAL, EDIT_MAILBOX_FORM_NAME, EDIT_FOLDER_FORM_NAME, messages } from '../constants'
import ModalSettingsMailService from '../components/ModalSettingsMailService'

import * as actions from '../actions'


const stateToProps = (state) => {
  return {
    title: intlObject.intl.formatMessage(messages.settings),
    size: MODAL_SIZES.small,

    settingsMailServiceForm: forms.selectors.settingsMailServiceForm.getForm(state),

    mailboxes: api.selectors.entityManager.mailboxes.getEntities(state).getArray(),
    editMailboxesForm: forms.selectors.getForm(EDIT_MAILBOX_FORM_NAME)(state),
    editMailboxesFormErrors: forms.selectors.getErrors(EDIT_MAILBOX_FORM_NAME)(state),
    editMailboxesFormValid: forms.selectors.getIsValid(EDIT_MAILBOX_FORM_NAME)(state),

    folders: api.selectors.entityManager.folders.getEntities(state).getArray(),
    editFolderForm: forms.selectors.getForm(EDIT_FOLDER_FORM_NAME)(state),
    editFolderFormErrors: forms.selectors.getErrors(EDIT_FOLDER_FORM_NAME)(state),
    editFolderFormValid: forms.selectors.getIsValid(EDIT_FOLDER_FORM_NAME)(state),
  }
}

const dispatchToProps = (dispatch) => ({
  mailServiceActions: bindActionCreators(actions, dispatch),
  settingsMailServiceFormActions: bindActionCreators(forms.actions.settingsMailServiceForm, dispatch),
  foldersApiActions: bindActionCreators(api.actions.entityManager.folders, dispatch),
  editFolderFormActions: bindActionCreators(forms.getFormActions(EDIT_FOLDER_FORM_NAME), dispatch),
  mailboxesApiActions: bindActionCreators(api.actions.entityManager.mailboxes, dispatch),
  editMailboxesFormActions: bindActionCreators(forms.getFormActions(EDIT_MAILBOX_FORM_NAME), dispatch),
})

export default registerModal(SETTINGS_MAIL_MODAL, stateToProps, dispatchToProps)(ModalSettingsMailService)
