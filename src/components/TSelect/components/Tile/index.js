import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import List, { LIST_ORIENTATION, LIST_TYPES } from '../List'


const valueTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
])

class Tile extends PureComponent {
  static propTypes = {
    className: PropTypes.string,

    type: PropTypes.oneOf(Object.values(LIST_TYPES)),
    orientation: PropTypes.oneOf(Object.values(LIST_ORIENTATION)),
    multi: PropTypes.bool,
    label: PropTypes.node,
    placeHolder: PropTypes.node,
    items: PropTypes.arrayOf(PropTypes.shape({
      value: valueTypes,
      label: PropTypes.node,
    })),
    values: PropTypes.arrayOf(valueTypes),

    disabled: PropTypes.bool,
    defaultOpen: PropTypes.bool,

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    missingValueResolver: PropTypes.func,
  }

  static defaultProps = {
    type: LIST_TYPES.tile,
    orientation: LIST_ORIENTATION.horizontal,
    items: [],
    values: [],

    defaultOpen: false,

    onChange: () => {},
    onBlur: () => {},
    missingValueResolver: v => v,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: this.props.defaultOpen,
    }

    this.renderDisplayValue = this.renderDisplayValue.bind(this)
    this.toggleOpen = this.toggleOpen.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  toggleOpen(value) {
    const { disabled, onBlur } = this.props
    if (!disabled) {
      const open = value === undefined ? !this.state.open : value
      if (this.state.open && !open) {
        onBlur()
      }
      this.setState({ open })
    }
  }

  handleChange(value) {
    const { multi, onChange } = this.props
    if (!multi) this.toggleOpen(false)
    onChange(value)
  }

  renderDisplayValue = () => {
    const {
      items,
      values,
      placeHolder,
      missingValueResolver,
    } = this.props
    if (!values.length && placeHolder) return placeHolder
    if (values.length === 1) {
      const item = items.find(el => el.value === values[0]) || {}
      return item.selectedLabel || item.label || missingValueResolver(values[0])
    }
    return values.length
  }

  render() {
    const {
      className,
      values,
      label,
      placeHolder,
    } = this.props
    const { open } = this.state

    return (
      <div {...{
        className: classNames(style.root, className),
      }}>
        {
          !open &&
          <div {...{
            className: values.length ? style.value : style.placeholder,
            onClick: () => this.toggleOpen(),
            'data-cy': label || placeHolder,
          }}>
            {this.renderDisplayValue()}
          </div>
        }
        {
          open &&
          <List {...{
            ...this.props,
            onChange: this.handleChange,
          }} />
        }
      </div>
    )
  }
}

export default Tile
