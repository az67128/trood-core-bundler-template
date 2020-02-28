import cssVars from '$trood/styles/variables.css'


const onlyNumber = (value = '') => {
  return value.toString().replace(/[^\d\.]+/g, '')
}

const replaceNumber = (value = '', replacement) => {
  return value.toString().replace(/[\d\.]+/g, replacement)
}

export const GRID_COLUMNS = 3
export const DEFAULT_SPAN = 1

export const GRID_MARGIN = cssVars.troodGridGap
export const TROOD_PAGE_PADDING = cssVars.troodPagePadding

export const GRID_COMPONENT_TYPE = '$TROOD_GRID'

export const getMobileMargin = margin => {
  if (!margin) return margin
  const numMargin = onlyNumber(margin)
  return replaceNumber(margin, numMargin / 2)
}
