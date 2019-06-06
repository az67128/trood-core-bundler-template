import { registerModal, MODAL_SIZES } from '$trood/modals'

import TAvatarEditor from '../components/TAvatarEditor'

import { IMAGE_EDITOR_MODAL } from '../constants'

const stateToProps = (state, startProps) => {
  return {
    ...startProps,
    title: 'Edit image',
    size: MODAL_SIZES.small,
  }
}

export default registerModal(IMAGE_EDITOR_MODAL, stateToProps)(TAvatarEditor)
