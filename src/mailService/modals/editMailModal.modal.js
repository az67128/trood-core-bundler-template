import { bindActionCreators } from 'redux'

import { registerModal, MODAL_SIZES } from '$trood/modals'

import files from '$trood/files'

import { api, forms } from 'redux-restify'

import { intlObject } from '$trood/localeService'

import { EDIT_MAIL_MODAL, getMailFormName, messages } from '../constants'
import ModalEditMail from '../components/ModalEditMail'

import * as actions from '../actions'


const stateToProps = (state) => {
  const startingToAddress = forms.selectors.mailServiceConfigForm.getField('startingToAddress')(state)

  return {
    title: intlObject.intl.formatMessage(messages.newMessage),
    size: MODAL_SIZES.medium,

    startingToAddress,

    mailboxes: api.selectors.entityManager.mailboxes.getEntities(state).getArray(),

    filesEntities: api.selectors.entityManager.files.getEntities(state),

    model: forms.selectors.getForm(getMailFormName(startingToAddress))(state),
    modelErrors: forms.selectors.getErrors(getMailFormName(startingToAddress))(state),
    modelValid: forms.selectors.getIsValid(getMailFormName(startingToAddress))(state),
  }
}

const dispatchToProps = (dispatch) => ({
  dispatch,
  mailServiceActions: bindActionCreators(actions, dispatch),
  filesActions: bindActionCreators(files.actions, dispatch),
})

const mergeProps = (stateProps, dispatchProps) => {
  const mailFormActions = forms.getFormActions(getMailFormName(stateProps.startingToAddress))
  return ({
    ...stateProps,
    ...dispatchProps,
    cancelAction: bindActionCreators(mailFormActions.deleteForm, dispatchProps.dispatch),
    mailFormActions: bindActionCreators(
      mailFormActions,
      dispatchProps.dispatch,
    ),
  })
}

export default registerModal(EDIT_MAIL_MODAL, stateToProps, dispatchToProps, mergeProps)(ModalEditMail)
