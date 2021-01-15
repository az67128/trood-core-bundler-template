import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './index.module.css'


const SIZES = ['xs', 'sm', 'md', 'lg', 'xl']

const Cell = (props) => {
  const {
    children,
    className,
    verticalPadding,
    topPadding,
    bottomPadding,
    ...other
  } = props

  const { sizeClasses, hiddenClasses, autoClasses, offsetClasses } = SIZES.reduce((memo, size) => {
    const sizePrefix = size === 'xs' ? '' : '-' + size

    const sizeProp = props[size]
    delete other[size]
    const sizeHiddenProp = props[`${size}Hidden`]
    delete other[`${size}Hidden`]
    const sizeAutoProp = props[`${size}Auto`]
    delete other[`${size}Auto`]
    const sizeOffsetProp = props[`${size}Offset`]
    delete other[`${size}Offset`]

    let { sizeClasses, hiddenClasses, autoClasses, offsetClasses } = memo

    if (sizeProp) sizeClasses = [...sizeClasses, styles[`aa-Cell${sizePrefix}-${sizeProp}`]]
    if (sizeHiddenProp) hiddenClasses = [...hiddenClasses, styles[`aa-Cell-${size}-hidden`]]
    if (sizeAutoProp) autoClasses = [...autoClasses, styles[`aa-Cell${sizePrefix}-auto`]]
    if (sizeOffsetProp) offsetClasses = [...offsetClasses, styles[`aa-Cell-offset${sizePrefix}-${sizeProp}`]]

    return { sizeClasses, hiddenClasses, autoClasses, offsetClasses }
  }, {
    sizeClasses: [],
    hiddenClasses: [],
    autoClasses: [],
    offsetClasses: [],
  })

  const style = {
    paddingTop: `${verticalPadding || topPadding}px`,
    paddingBottom: `${verticalPadding || bottomPadding}px`,
  }

  return (
    <div
      {...other}
      style={style}
      className={classNames(
        className,
        styles['aa-Cell'],
        ...sizeClasses,
        ...hiddenClasses,
        ...autoClasses,
        ...offsetClasses,
      )}
    >
      {children}
    </div>
  )
}

Cell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  xs: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  sm: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  md: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  lg: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  xl: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  xsHidden: PropTypes.bool,
  smHidden: PropTypes.bool,
  mdHidden: PropTypes.bool,
  lgHidden: PropTypes.bool,
  xlHidden: PropTypes.bool,
  xsOffset: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  smOffset: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  mdOffset: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  lgOffset: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  xlOffset: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  xsAuto: PropTypes.bool,
  smAuto: PropTypes.bool,
  mdAuto: PropTypes.bool,
  lgAuto: PropTypes.bool,
  xlAuto: PropTypes.bool,
  verticalPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  topPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bottomPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default Cell
