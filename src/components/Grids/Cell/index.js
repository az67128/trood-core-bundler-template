/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import './index.css'
import styled from 'styled-components'
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl']

const Cell = (props) => {
  const {children, className, verticalPadding, topPadding, bottomPadding, bddmark = 'ячейка'} = props

  const sizeClasses = SIZES.map((size) => {
    const sizeProp = props[size]
    return sizeProp ? `aa-Cell${size === 'xs' ? '' : '-' + size}-${sizeProp}` : ''
  }).join(' ')

  const hiddenClasses = SIZES.map((size) => {
    const sizeProp = props[`${size}Hidden`]
    return sizeProp ? `aa-Cell-${size}-hidden` : ''
  }).join(' ')

  const autoClasses = SIZES.map((size) => {
    const sizeProp = props[`${size}Auto`]
    return sizeProp ? `aa-Cell${size === 'xs' ? '' : '-' + size}-auto` : ''
  }).join(' ')

  const offsetClasses = SIZES.map((size) => {
    const sizeProp = props[`${size}Offset`]
    return sizeProp ? `aa-Cell-offset${size === 'xs' ? '' : '-' + size}-${sizeProp}` : ''
  }).join(' ')

  const style = {
    paddingTop: `${verticalPadding || topPadding}px`,
    paddingBottom: `${verticalPadding || bottomPadding}px`,
  }

  return (
    <div
      bddmark={bddmark}
      style={style}
      className={`aa-Cell ${className || ''} ${sizeClasses} ${hiddenClasses} ${autoClasses} ${offsetClasses}`}
    >
      {children}
    </div>
  )
}

Cell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  /* eslint-disable react/no-unused-prop-types */
  xs: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]),
  sm: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]),
  md: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]),
  lg: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]),
  xl: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]),
  xsHidden: PropTypes.bool,
  smHidden: PropTypes.bool,
  mdHidden: PropTypes.bool,
  lgHidden: PropTypes.bool,
  xlHidden: PropTypes.bool,
  xsOffset: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]),
  smOffset: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]),
  mdOffset: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]),
  lgOffset: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]),
  xlOffset: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11, 12]),
  xsAuto: PropTypes.bool,
  smAuto: PropTypes.bool,
  mdAuto: PropTypes.bool,
  lgAuto: PropTypes.bool,
  xlAuto: PropTypes.bool,
  /* eslint-enable */
  verticalPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  topPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bottomPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bddmark: PropTypes.string,
}

export default styled(Cell)`${props => props.style || ''}`
