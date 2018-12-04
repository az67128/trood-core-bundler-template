import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import { LOADING_INDICATOR_TYPES } from './constants'

import TIcon from '$trood/components/TIcon'
import { ICONS_TYPES } from '$trood/components/TIcon/constants'

import { toNumber } from '$trood/helpers/format'


const circleRadius = 40
const circleViewBox = 100

class LoadingIndicator extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(Object.values(LOADING_INDICATOR_TYPES)),
    progress: PropTypes.number,
  }

  static defaultProps = {
    className: '',
    type: LOADING_INDICATOR_TYPES.spinner,
  }

  render() {
    const {
      className,
      type,
      progress,
      ...other
    } = this.props

    let circleDashOffset = 0
    let circleLength
    if (type === LOADING_INDICATOR_TYPES.circle) {
      circleLength = Math.PI * circleRadius * 2
      circleDashOffset = circleLength * (100 - progress) / 100
    }

    return (
      <div {...{
        className: classNames(style.root, className, style[type]),
      }} >
        {type === LOADING_INDICATOR_TYPES.text &&
          <span>
            loading
            {!!progress && ` (${toNumber(progress)}) `}
            ...
          </span>
        }
        {type === LOADING_INDICATOR_TYPES.spinner &&
          <TIcon {...{
            className: style.spinnerIcon,
            type: ICONS_TYPES.spinner,
            ...other,
          }} />
        }
        {type === LOADING_INDICATOR_TYPES.circle &&
          <svg className={style.circle} viewBox={`0 0 ${circleViewBox} ${circleViewBox}`}>
            <circle {...{
              className: style.circleNotLoaded,
              r: circleRadius,
              cx: circleViewBox / 2,
              cy: circleViewBox / 2,
              fill: 'transparent',
              strokeDasharray: circleLength,
              strokeDashoffset: 0,
            }} />
            <circle {...{
              className: style.circleLoaded,
              r: circleRadius,
              cx: circleViewBox / 2,
              cy: circleViewBox / 2,
              fill: 'transparent',
              strokeDasharray: circleLength,
              strokeDashoffset: Number.isNaN(circleDashOffset) ? `${circleLength}px` : `${circleDashOffset}px`,
            }} />
          </svg>
        }
      </div>
    )
  }
}

export default LoadingIndicator
