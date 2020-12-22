import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'


import ClickOutside from '../../../internal/ClickOutside'
import Icon, { ROTATE_TYPES, ICONS_TYPES } from '../../../Icon'
import Button, { BUTTON_SPECIAL_TYPES } from '../../../Button'
import Input from '../../../Input'

import List, { LIST_TYPES } from '../List'

import { KEY_CODES } from '../../../internal/constants'
import { DEFAULT_MAX_ROWS, defaultFilterFunction } from './constants'
import { selectValue } from '../../constants'

import style from './index.module.css'


const valueTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
])

class DropDown extends PureComponent {
  static propTypes = {
    controlClassName: PropTypes.string,
    valueClassName: PropTypes.string,
    mainSelectContainerStyle: PropTypes.object,

    type: PropTypes.oneOf(Object.values(LIST_TYPES)),
    openUp: PropTypes.bool,
    multi: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({
      value: valueTypes,
      label: PropTypes.node,
    })),
    values: PropTypes.arrayOf(valueTypes),
    label: PropTypes.node,
    iconProps: PropTypes.object,
    placeHolder: PropTypes.node,
    showSearch: PropTypes.bool,
    isLoading: PropTypes.bool,

    defaultOpen: PropTypes.bool,
    maxRows: PropTypes.number,
    autoScroll: PropTypes.bool,
    disabled: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.string),

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onSearch: PropTypes.func,
    onAdd: PropTypes.func,
    missingValueResolver: PropTypes.func,

    children: PropTypes.node,
  }

  static defaultProps = {
    items: [],
    values: [],
    iconProps: {},

    defaultOpen: false,
    maxRows: DEFAULT_MAX_ROWS,
    autoScroll: true,
    errors: [],
    tabIndex: 0,

    onChange: () => {},
    onBlur: () => {},
    onFocus: () => {},
    missingValueResolver: v => v,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: this.props.defaultOpen,
      innerSearch: undefined,
      focusedItem: undefined,
    }

    this.renderDisplayValue = this.renderDisplayValue.bind(this)
    this.toggleOpen = this.toggleOpen.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeSearchValue = this.handleChangeSearchValue.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.getItems = this.getItems.bind(this)
  }

  getItems() {
    const { items, onSearch } = this.props
    const { innerSearch } = this.state
    if (innerSearch && !onSearch) {
      return defaultFilterFunction(innerSearch, items)
    }
    return items
  }

  handleChangeSearchValue(value) {
    this.setState({ innerSearch: value })
  }

  handleSearch(value) {
    const { onSearch } = this.props
    if (onSearch) {
      onSearch(value)
    }
  }

  toggleOpen(value, focusedItem) {
    const { disabled, onBlur, onFocus } = this.props
    if (!disabled) {
      const open = value === undefined ? !this.state.open : value
      if (this.state.open !== open) {
        if (open) {
          onFocus()
        } else {
          onBlur()
          this.handleSearch()
        }
      }
      this.setState({ open, innerSearch: undefined, focusedItem })
    }
  }

  handleChange(value) {
    const { multi, onChange } = this.props
    if (!multi) this.toggleOpen(false)
    onChange(value)
  }

  handleKeyDown(e) {
    const { open, focusedItem } = this.state

    const items = this.getItems()

    if (e.key === KEY_CODES.arrowDown) {
      if (!open) {
        this.toggleOpen(true, 0)
      } else if (items.length) {
        this.setState({
          focusedItem: focusedItem === undefined || focusedItem === items.length - 1 ? 0 : focusedItem + 1,
        })
      }
      e.preventDefault()
    } else if (e.key === KEY_CODES.arrowUp) {
      if (open && items.length) {
        this.setState({
          focusedItem: focusedItem === undefined || focusedItem === 0 ? items.length - 1 : focusedItem - 1,
        })
      }
      e.preventDefault()
    } else if (e.key === KEY_CODES.esc) {
      if (open) {
        this.toggleOpen()
      }
      e.preventDefault()
    } else if (e.key === KEY_CODES.enter) {
      if (open) {
        const focusedItemValue = (items[focusedItem] || {}).value
        selectValue(focusedItemValue, {
          ...this.props,
          onChange: this.handleChange,
        })
      } else {
        this.toggleOpen(true, 0)
      }
      e.preventDefault()
    }
  }

  renderDisplayValue = () => {
    const {
      items,
      values,
      label,
      placeHolder,
      showSearch,
      missingValueResolver,
    } = this.props
    const { open, innerSearch } = this.state
    if (open && showSearch) {
      return (
        <Input {...{
          'data-cy': `${label}_search`,
          inputClassName: style.search,
          autoFocus: true,
          value: innerSearch,
          onSearch: this.handleSearch,
          onChange: this.handleChangeSearchValue,
        }} />
      )
    }
    if (!values.length && placeHolder) return placeHolder
    if (values.length === 1) {
      const item = items.find(el => el.value === values[0]) || {}
      return item.selectedLabel || item.label || missingValueResolver(values[0])
    }
    return values.length
  }

  render() {
    const {
      dataAttributes,
      controlClassName,
      valueClassName,
      mainSelectContainerStyle,

      type = (this.props.multi ? LIST_TYPES.checkbox : LIST_TYPES.text),
      openUp,
      values,
      label,
      placeHolder,
      showSearch,
      iconProps,

      tabIndex,
      disabled,
      errors,
      isLoading,

      onAdd,
    } = this.props

    const { open, innerSearch, focusedItem } = this.state

    const items = this.getItems()

    let { children } = this.props

    if (!isLoading && onAdd && innerSearch
      && !items.some(item => item.value === innerSearch || item.label === innerSearch)) {
      children = [
        <Button {...{
          key: 'add',
          label: innerSearch,
          specialType: BUTTON_SPECIAL_TYPES.add,
          className: style.addButton,
          onClick: () => {
            onAdd(innerSearch)
            this.toggleOpen(false)
          },
        }} />,
      ].concat(children)
    }

    return (
      <ClickOutside onClick={() => this.toggleOpen(false)}>
        <div {...{
          tabIndex: disabled ? -1 : tabIndex,
          style: mainSelectContainerStyle,
          className: classNames(
            controlClassName,
            style.root,
            errors.length && style.error,
            disabled && style.disabled,
            open && style.open,
          ),
          onKeyDown: this.handleKeyDown,
        }}>
          <span {...{
            ...dataAttributes,
            className: style.content,
            onClick: showSearch && open ? undefined : () => this.toggleOpen(),
            'data-cy': label || placeHolder,
          }}>
            <span className={classNames(values.length ? style.value : style.placeholder, valueClassName)}>
              {this.renderDisplayValue()}
            </span>
          </span>
          <Icon {...{
            dataAttributes,
            size: 8,
            type: ICONS_TYPES.triangleArrow,
            rotate: open ? ROTATE_TYPES.up : ROTATE_TYPES.down,
            onClick: () => this.toggleOpen(),
            ...iconProps,
            className: classNames(style.control, iconProps.className),
          }} />
          <div className={classNames(style.optionsContainer, openUp && style.openUp, !open && style.hide)}>
            <List {...{
              ...this.props,
              dataAttributes: undefined,
              focusedItem,
              show: open,
              type,
              items,
              onChange: this.handleChange,
            }} />
            {
              !!children &&
              <div className={style.children}>
                {children}
              </div>
            }
          </div>
        </div>
      </ClickOutside>
    )
  }
}

export default DropDown
