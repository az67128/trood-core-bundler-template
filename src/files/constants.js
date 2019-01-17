import { snakeToCamel } from '$trood/helpers/namingNotation'

export const NAME = 'files'

export const FILE_TYPE_IMAGE = 'IMAGE'
export const FILE_TYPE_PDF = 'PDF'
export const FILE_TYPE_CSV = 'CSV'
export const FILE_TYPE_OFFICE = 'OFFICE'
export const FILE_TYPE_DOCS = 'DOCS'

export const FILE_TYPES = {
  [snakeToCamel(FILE_TYPE_IMAGE)]: FILE_TYPE_IMAGE,
  [snakeToCamel(FILE_TYPE_PDF)]: FILE_TYPE_PDF,
  [snakeToCamel(FILE_TYPE_CSV)]: FILE_TYPE_CSV,
  [snakeToCamel(FILE_TYPE_OFFICE)]: FILE_TYPE_OFFICE,
  [snakeToCamel(FILE_TYPE_DOCS)]: FILE_TYPE_DOCS,
}

export const OPENING_FILE_TYPES = [
  FILE_TYPES.pdf,
  FILE_TYPES.office,
  FILE_TYPES.docs,
  FILE_TYPES.image,
]

export const GOOGLE_DOCS_VIEWER = 'https://docs.google.com/viewer?url='
export const MS_OFFICE_VIEWER = 'https://view.officeapps.live.com/op/view.aspx?src='

export const IMAGE_VIEWER_MODAL = 'imageViewerModal'
