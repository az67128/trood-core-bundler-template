import { defineMessages } from 'react-intl'

import { intlObject } from '$trood/localeService'

import { registerModal, MODAL_SIZES } from '$trood/modals'

import TAvatarEditor from '../components/TAvatarEditor'

import { IMAGE_EDITOR_MODAL } from '../constants'


const messages = defineMessages({
  editImage: {
    id: 'files.modals.imageEditorModal.edit_image',
    defaultMessage: 'Edit image',
  },
})

const stateToProps = (state, startProps) => {
  return {
    ...startProps,
    title: intlObject.intl.formatMessage(messages.editImage),
    size: MODAL_SIZES.small,
  }
}

export default registerModal(IMAGE_EDITOR_MODAL, stateToProps)(TAvatarEditor)
