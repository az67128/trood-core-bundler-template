import PropTypes from 'prop-types'


export const NAME = 'files'

export const FILE_SOURCE_PROP_TYPE = PropTypes.oneOfType([
  PropTypes.string, // Path to file
  // TODO by @deylak define object shape, after defining file formats from backend and business logic
  PropTypes.object, // File object
])


// Known system file formats
export const FILE_TYPE_IMAGE = 'image'
export const FILE_TYPE_EXCEL = 'excel'
export const FILE_TYPE_PRESENTATION = 'presentation'
export const FILE_TYPE_WORD = 'word'
export const FILE_TYPE_PDF = 'pdf'
export const FILE_TYPE_AUDIO = 'audio'
export const FILE_TYPE_CSV = 'csv'

export const FILE_TYPE_COMMON = 'common'

export const FILE_TYPES = {
  [FILE_TYPE_IMAGE]: FILE_TYPE_IMAGE,
  [FILE_TYPE_EXCEL]: FILE_TYPE_EXCEL,
  [FILE_TYPE_PRESENTATION]: FILE_TYPE_PRESENTATION,
  [FILE_TYPE_WORD]: FILE_TYPE_WORD,
  [FILE_TYPE_PDF]: FILE_TYPE_PDF,
  [FILE_TYPE_AUDIO]: FILE_TYPE_AUDIO,
  [FILE_TYPE_CSV]: FILE_TYPE_CSV,
  [FILE_TYPE_COMMON]: FILE_TYPE_COMMON,
}

export const FILE_FORMAT_PROP_TYPE = PropTypes.shape({
  type: PropTypes.oneOf(Object.values(FILE_TYPES)),
  ext: PropTypes.string,
})

// Regexps for defining known formats
export const IMAGE_FILE_FORMAT_REGEXP = /\.(gif|jpe?g|jf?if|png|tiff|webp)$/i
export const EXCEL_FILE_FORMAT_REGEXP = /\.(xlsx?|csv)$/i
export const PPT_FILE_FORMAT_REGEXP = /\.(pptx?)$/i
export const WORD_FILE_FORMAT_REGEXP = /\.(docx?)$/i
export const PDF_FILE_FORMAT_REGEXP = /\.(pdf?)$/i
export const CSV_FILE_FORMAT_REGEXP = /\.(csv?)$/i
export const AUDIO_FILE_FORMAT_REGEXP = /\.(mp[34]|wav|aac|ogg|wma)$/i

export const ANY_FILE_FORMAT_REGEXP = /\.([^.]+)$/

export const FILE_TYPES_REGEXPS = {
  [FILE_TYPE_IMAGE]: IMAGE_FILE_FORMAT_REGEXP,
  [FILE_TYPE_EXCEL]: EXCEL_FILE_FORMAT_REGEXP,
  [FILE_TYPE_PRESENTATION]: PPT_FILE_FORMAT_REGEXP,
  [FILE_TYPE_WORD]: WORD_FILE_FORMAT_REGEXP,
  [FILE_TYPE_PDF]: PDF_FILE_FORMAT_REGEXP,
  [FILE_TYPE_CSV]: CSV_FILE_FORMAT_REGEXP,
  [FILE_TYPE_AUDIO]: AUDIO_FILE_FORMAT_REGEXP,

  // Should be at the end for treating as default format
  [FILE_TYPE_COMMON]: ANY_FILE_FORMAT_REGEXP,
}

export const defineFormatByName = (fileName) => {
  let lastMatches = []
  const type = Object.keys(FILE_TYPES_REGEXPS).find(key => {
    lastMatches = fileName.match(FILE_TYPES_REGEXPS[key])
    return lastMatches
  })
  const extension = lastMatches && lastMatches[1]
  return {
    type,
    ext: extension || '',
  }
}
