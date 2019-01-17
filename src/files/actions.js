import { forms } from 'redux-restify'
import modals from '$trood/modals'

import { FILE_API_HOST } from '$trood/fileApiUrlSchema'
import {
  FILE_TYPES,
  OPENING_FILE_TYPES,
  GOOGLE_DOCS_VIEWER,
  MS_OFFICE_VIEWER,
  IMAGE_VIEWER_MODAL,
} from './constants'


export const uploadFile = (file) => (dispatch) => {
  return dispatch(forms.actions.sendQuickForm({
    model: 'files',
    defaults: {
      file,
      name: file.name,
    },
  }))
}

export const canOpenFile = (file) => () => {
  if (OPENING_FILE_TYPES.includes(file.type)) {
    return true
  }
  return false
}

export const openFile = (file) => (dispatch) => {
  const { type, fileUrl } = file
  const href = /^https?:\/\//.test(fileUrl) ? fileUrl : `${FILE_API_HOST}${fileUrl}`

  switch (type) {
    case FILE_TYPES.office:
      window.open(`${MS_OFFICE_VIEWER}${href}`, '_blank')
      break
    case FILE_TYPES.docs:
    case FILE_TYPES.pdf:
      window.open(`${GOOGLE_DOCS_VIEWER}${href}`, '_blank')
      break
    case FILE_TYPES.image:
      dispatch(modals.actions.showModal(true, IMAGE_VIEWER_MODAL, { file }))
      break
    default:
  }
}
