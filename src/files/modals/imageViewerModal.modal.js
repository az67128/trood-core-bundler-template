import { registerModal, MODAL_SIZES } from '$trood/modals'

import ImageViewer, { DownloadButton } from '../components/ImageViewer'

import { IMAGE_VIEWER_MODAL } from '../constants'

const stateToProps = (state, startProps) => {
  return {
    title: (startProps.file || {}).originFilename,
    size: MODAL_SIZES.full,
    buttons: DownloadButton,
    ...startProps,
  }
}

export default registerModal(IMAGE_VIEWER_MODAL, stateToProps)(ImageViewer)
