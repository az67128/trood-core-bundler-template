import { api, forms } from 'redux-restify'

import modals from '$trood/modals'

import {
  EDIT_MAILBOX_FORM_NAME,
  EDIT_FOLDER_FORM_NAME,
  SETTINGS_MAIL_MODAL,
  MOVE_MAIL_MODAL,
  EDIT_MAIL_MODAL,
  getMailFormName,
  getHtmlMailInfo,
} from './constants'


export const createMailForm = (mail) => async (dispatch, getState) => {
  const newForm = forms.createFormConfig({
    baseConfig: 'baseEditMailForm',
    defaults: {
      isRead: true,
    },
    values: {
      ...mail,
      to: mail.to ? [].concat(mail.to) : [],
    },
  })

  const formName = getMailFormName(mail.to)
  dispatch(forms.actions.createForm(formName, newForm, true))

  const state = getState()
  return forms.selectors.getForm(formName)(state)
}

export const writeMail = (to) => (dispatch, getState) => {
  const state = getState()
  const formName = getMailFormName(to)
  const mailForm = forms.selectors.getForm(formName)(state)
  if (!mailForm) {
    dispatch(createMailForm({ to }))
  }
  dispatch(forms.actions.mailServiceConfigForm.changeField('startingToAddress', to))
  dispatch(modals.actions.showModal(true, EDIT_MAIL_MODAL))
}

export const forwardMail = (mail) => (dispatch) => {
  dispatch(createMailForm({
    attachedMail: `${getHtmlMailInfo(mail)}${mail.body}`,
    subject: `FWD: ${mail.subject}`,
    attachments: mail.attachmentsIds,
  }))
  dispatch(forms.actions.mailServiceConfigForm.changeField('startingToAddress', undefined))
  dispatch(modals.actions.showModal(true, EDIT_MAIL_MODAL))
}

export const replayMail = (mail) => (dispatch) => {
  const to = mail.fromAddress[0]
  dispatch(createMailForm({
    attachedMail: `${getHtmlMailInfo(mail)}${mail.body}`,
    subject: `RE: ${mail.subject}`,
    inReplyTo: mail.id,
    to,
  }))
  dispatch(forms.actions.mailServiceConfigForm.changeField('startingToAddress', to))
  dispatch(modals.actions.showModal(true, EDIT_MAIL_MODAL))
}

export const sendMail = (to) => (dispatch, getState) => {
  const formName = getMailFormName(to)
  const formActions = forms.getFormActions(formName)
  dispatch(formActions.submit())
    .then(
      ({ data }) =>
        api.selectors.entityManager.chains.getEntities(getState()).getById(data.chain, { forceLoad: true }),
    )
}

export const deleteMail = (id) => (dispatch) => {
  return dispatch(api.actions.entityManager.mails.deleteById(id))
}

export const setChainRead = (chainId, mails = []) => (dispatch, getState) => {
  const setMailReadActions = []
  mails.forEach(mail => {
    if (!mail.isRead) {
      setMailReadActions.push(
        dispatch(forms.actions.sendQuickForm({
          model: 'mails',
          values: {
            id: mail.id,
            isRead: true,
          },
        })),
      )
    }
    if (setMailReadActions.length) {
      Promise.all(setMailReadActions)
        .then(() => api.selectors.entityManager.chains.getEntities(getState()).getById(chainId, { forceLoad: true }))
    }
  })
}

export const moveChains = (chain, folder) => (dispatch) => {
  if (folder) {
    dispatch(forms.actions.mailServiceConfigForm.resetField('movingId'))
    return dispatch(forms.actions.sendQuickForm({
      model: 'chains',
      values: {
        id: chain,
        folder,
      },
    }))
  }
  dispatch(forms.actions.mailServiceConfigForm.changeField('movingId', chain))
  dispatch(modals.actions.showModal(true, MOVE_MAIL_MODAL))
  return Promise.resolve()
}

export const createFoldersForm = (id) => async (dispatch, getState) => {
  const newForm = forms.createFormConfig({
    baseConfig: 'baseEditFolderForm',
    defaults: {
      id,
    },
  })
  const state = getState()
  const defaultsModel =
    await api.selectors.entityManager.folders.getEntities(state).asyncGetById(id)

  dispatch(forms.actions.createForm(EDIT_FOLDER_FORM_NAME, newForm, true))
  const formActions = forms.getFormActions(EDIT_FOLDER_FORM_NAME)
  if (defaultsModel) {
    dispatch(formActions.applyServerData(defaultsModel))
  }
}

export const createMailboxesForm = (
  id,
) => async (dispatch, getState) => {
  const newForm = forms.createFormConfig({
    baseConfig: 'baseEditMailboxForm',
    defaults: {
      id,
    },
  })
  const state = getState()
  const defaultsModel =
    await api.selectors.entityManager.mailboxes.getEntities(state).asyncGetById(id)

  dispatch(forms.actions.createForm(EDIT_MAILBOX_FORM_NAME, newForm, true))
  const formActions = forms.getFormActions(EDIT_MAILBOX_FORM_NAME)
  if (defaultsModel) {
    dispatch(formActions.applyServerData(defaultsModel))
  }
}

export const showMailServiceSettingsModal = () => (dispatch) => {
  dispatch(modals.actions.showModal(true, SETTINGS_MAIL_MODAL))
}
