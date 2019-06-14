import { bindActionCreators } from 'redux'

import { registerModal, MODAL_SIZES } from '$trood/modals'

import { api, forms } from 'redux-restify'

import { intlObject } from '$trood/localeService'

import { MOVE_MAIL_MODAL, messages } from '../constants'
import ModalMoveMail from '../components/ModalMoveMail'

import * as actions from '../actions'


const stateToProps = (state) => {
  return {
    title: intlObject.intl.formatMessage(messages.moveToFolder),
    size: MODAL_SIZES.small,

    chainsEntities: api.selectors.entityManager.chains.getEntities(state),
    mailServiceConfigForm: forms.selectors.mailServiceConfigForm.getForm(state),

    folders: api.selectors.entityManager.folders.getEntities(state).getArray(),
  }
}

const dispatchToProps = (dispatch) => ({
  chainsActions: bindActionCreators(api.actions.entityManager.chains, dispatch),
  mailServiceActions: bindActionCreators(actions, dispatch),
})

export default registerModal(MOVE_MAIL_MODAL, stateToProps, dispatchToProps)(ModalMoveMail)
