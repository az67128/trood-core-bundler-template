import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'
import debounce from 'lodash/debounce'

import style from './index.module.css'

import Icon, { ICONS_TYPES } from '../../../Icon'

import { MOUSE_EVENT_DEBOUNCE } from './constants'


const defaultIconProps = {
  type: ICONS_TYPES.star,
  size: 32,
  activeIconClassName: style.yellow,
  inActiveIconClassName: style.gray,
}

class Rating extends PureComponent {
  static propTypes = {
    className: PropTypes.string,

    label: PropTypes.node,
    value: PropTypes.number,
    maxRating: PropTypes.number,
    icon: PropTypes.shape({
      type: PropTypes.oneOf(Object.values(ICONS_TYPES)),
      size: PropTypes.number,
      className: PropTypes.string,
      activeIconClassName: PropTypes.string,
      inActiveIconClassName: PropTypes.string,
    }),

    disabled: PropTypes.bool,

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  }

  static defaultProps = {
    maxRating: 5,

    icon: defaultIconProps,

    onChange: () => {},
    onBlur: () => {},
    onFocus: () => {},
  }

  constructor(props) {
    super(props)

    this.debouncedMouseLeave = debounce(this.props.onBlur, MOUSE_EVENT_DEBOUNCE)
    this.debouncedMouseEnter = debounce(this.props.onFocus, MOUSE_EVENT_DEBOUNCE)
  }

  render() {
    const {
      dataAttributes,
      className,
      maxRating,
      value,
      label,
      disabled,

      icon,

      onChange,
    } = this.props

    const ratingMaxArray = (new Array(maxRating)).fill(0)
    const iconProps = {
      ...defaultIconProps,
      ...icon,
    }

    return (
      <div {...{
        ...dataAttributes,
        className: classNames(style.root, disabled && style.disabled, className),
        onMouseLeave: () => this.debouncedMouseLeave(),
        onMouseEnter: () => this.debouncedMouseEnter(),
        'data-cy': label,
      }}>
        {ratingMaxArray.map((_, index) => {
          const isActive = index + 1 <= Math.round(maxRating * value / 100)

          return (
            <Icon {...{
              ...iconProps,
              key: index,
              onClick: () => onChange(100 * (index + 1) / maxRating),
              className: classNames(
                style.icon,
                iconProps.className,
                isActive ? iconProps.activeIconClassName : iconProps.inActiveIconClassName,
              ),
            }} />
          )
        })}
      </div>
    )
  }
}

export default Rating
