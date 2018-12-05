import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'
import classNames from 'classnames'
import deepEqual from 'deep-equal'

import style from './index.css'
import fadeInWithHeight from '$trood/styles/transitions/fadeInWithHeight.css'

import {
  DEFAULT_MAX_ROWS,
  EMPTY_ITEMS_LABEL,
  SELECT_TYPES,
  RADIO_GROUP_TYPES,
  ERROR_TYPES,
  defaultFilterFunction,
} from './constants'

import TRadioButton, { RADIO_TYPES } from '$trood/components/TRadioButton'
import TCheckbox from '$trood/components/TCheckbox'
import TToggle from '$trood/components/TToggle'
import TLabel from '$trood/components/TLabel'
import TClickOutside from '$trood/components/TClickOutside'
import TIcon, { ROTATE_TYPES, ICONS_TYPES } from '$trood/components/TIcon'
import TInput from '$trood/components/TInput'


const SCROLL_THRESHOLD = 20

const valueTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
])

class TSelect extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    controlClassName: PropTypes.string,
    selectItemClassName: PropTypes.string,

    multi: PropTypes.bool,
    autoscroll: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({
      value: valueTypes,
      label: PropTypes.node,
      selectedLabel: PropTypes.node, // Used for rendering item in selected section
    })),
    type: PropTypes.oneOf(Object.values(SELECT_TYPES)),
    radioGroupType: PropTypes.oneOf(Object.values(RADIO_GROUP_TYPES)),
    radioType: PropTypes.oneOf(Object.values(RADIO_TYPES)),
    replaceSelectValues: PropTypes.arrayOf(valueTypes),
    disabled: PropTypes.bool,
    label: PropTypes.node,
    placeHolder: PropTypes.node,
    defaultValue: valueTypes,
    defaultOpen: PropTypes.bool,
    tooltip: PropTypes.string,
    maxRows: PropTypes.number,
    showClearButton: PropTypes.bool,
    children: PropTypes.node,
    errors: PropTypes.arrayOf(PropTypes.string),
    showTextErrors: PropTypes.bool,
    validate: PropTypes.shape({
      checkOnBlur: PropTypes.bool,
      required: PropTypes.bool,
    }),
    onChange: PropTypes.func,
    onValid: PropTypes.func,
    onInvalid: PropTypes.func,
    onBlur: PropTypes.func,
    asyncOnSearch: PropTypes.func,
    onScrollToEnd: PropTypes.func,
    emptyItemsLabel: PropTypes.node,
    missingValueResolver: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    labelClassName: '',
    selectItemClassName: '',

    multi: false,
    defaultOpen: false,
    type: SELECT_TYPES.dropdown,
    radioGroupType: RADIO_GROUP_TYPES.vertical,
    autoscroll: true,
    items: [],
    replaceSelectValues: [],
    disabled: false,
    maxRows: DEFAULT_MAX_ROWS,
    showClearButton: false,
    validate: {},
    errors: [],
    showTextErrors: true,
    onChange: () => {},
    onValid: () => {},
    onInvalid: () => {},
    onBlur: () => {},
    asyncOnSearch: defaultFilterFunction,
    onScrollToEnd: () => {},
    emptyItemsLabel: EMPTY_ITEMS_LABEL,
    missingValueResolver: value => value,
  }

  constructor(props) {
    super(props)
    this.state = {
      items: this.props.items,
      open: this.props.defaultOpen,
      selectValues: this.props.defaultValue ? [this.props.defaultValue] : [],
      maxHeight: -1,
      innerErrors: [],
      wasBlured: false,
    }
    this.scrollToEndFired = false
    this.select = this.select.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.clear = this.clear.bind(this)
    this.onValidationUpdate = this.onValidationUpdate.bind(this)
    this.validate = this.validate.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.handleSelectScroll = this.handleSelectScroll.bind(this)
  }

  componentDidMount() {
    this.validate(this.props.replaceSelectValues.length ? this.props.replaceSelectValues : this.state.selectValues)
    this.options.addEventListener('scroll', this.handleSelectScroll)
  }

  componentWillReceiveProps(nextProps) {
    if (!deepEqual(nextProps.items, this.props.items)) {
      this.scrollToEndFired = false
      this.setState({ items: nextProps.items })
    }
    if (!deepEqual(nextProps.replaceSelectValues, this.props.replaceSelectValues)) {
      this.validate(nextProps.replaceSelectValues)
    }
  }

  // TODO by @deylak refactor deprecated methods
  componentWillUpdate(nextProps, nextState) { /* eslint-disable react/no-will-update-set-state */
    if ((nextProps.type === SELECT_TYPES.dropdown || nextProps.type === SELECT_TYPES.filterDropdown)
      && nextState.open) {
      const maxHeight = this.options.firstChild.offsetHeight * this.props.maxRows
      if (!Number.isNaN(maxHeight) && nextState.maxHeight !== maxHeight) this.setState({ maxHeight })
    }
    if (nextProps.disabled && nextProps.disabled !== this.props.disabled) {
      this.setState({ open: false })
    }
    if (!deepEqual(nextProps.validate, this.props.validate)) {
      this.setState({
        innerErrors: [],
      }, () => {
        this.validate(nextProps.replaceSelectValues)
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      type,
      autoscroll,
      replaceSelectValues,
      items,
    } = this.props
    if ((type === SELECT_TYPES.dropdown || type === SELECT_TYPES.filterDropdown)
      && autoscroll && this.state.open && prevState.open !== this.state.open) {
      const selectValues = replaceSelectValues
      if (selectValues.length > 0) {
        this.validate(selectValues)
        const firstSelected = items.find(item => selectValues.some(val => val === item.value))
        if (firstSelected) {
          // Timeout is a workaround for hidden list not being scrolled.
          // Also not using scrollIntoView(), it's scrolling all containers, so the item is at the top of the page.
          setTimeout(() => scrollIntoViewIfNeeded(this[`option${firstSelected.value}`], {
            scrollMode: 'if-needed',
            block: 'nearest',
            inline: 'nearest',
          }), 0)
        }
      }
    }
  }

  onValidationUpdate() {
    const { disabled } = this.props
    const { innerErrors } = this.state

    if (!disabled) {
      if (innerErrors.length) {
        this.props.onInvalid(innerErrors)
      } else {
        this.props.onValid()
      }
    }
  }

  onSearch(value) {
    const {
      items,
      asyncOnSearch,
    } = this.props
    const promise = asyncOnSearch(value, items)
    if (promise instanceof Promise) {
      promise.then(res => this.setState({ items: res }))
    }
  }

  validate(values) {
    const innerErrors = this.props.validate.required && !values.length ?
      [ERROR_TYPES.required] : []
    this.setState({ innerErrors }, this.onValidationUpdate)
  }

  handleSelectScroll() {
    if (
      !this.scrollToEndFired &&
      // Check scroll to end
      this.options.scrollHeight - (this.options.scrollTop + this.options.clientHeight) < SCROLL_THRESHOLD
    ) {
      this.props.onScrollToEnd()
      this.scrollToEndFired = true
    }
  }

  select(value) {
    let newSelectValues = []
    if (this.props.multi) {
      newSelectValues = (this.props.replaceSelectValues || this.state.selectValues).filter(el => el !== value)
      if (newSelectValues.length === this.state.selectValues.length) {
        newSelectValues.push(value)
      }
    } else {
      newSelectValues = [value]
    }
    if (!newSelectValues.length && this.props.defaultValue) newSelectValues.push(this.props.defaultValue)
    this.onSearch(undefined)
    this.setState({
      open: this.props.multi, // don't hide list if component in multi mode
      selectValues: newSelectValues,
      items: this.props.items,
    }, () => this.props.onChange(this.state.selectValues))
  }

  clear() {
    this.setState({
      open: false,
      selectValues: [],
    }, () => this.props.onChange(this.state.selectValues))
  }

  open() {
    if (!this.props.disabled) {
      if (this.state.open) {
        this.close()
      } else {
        this.setState({ open: true, wasBlured: false })
      }
    }
  }

  close() {
    if (this.state.open) {
      this.props.onBlur()
      this.onSearch(undefined) // Reset any filtering
      this.setState({ open: false, wasBlured: true, items: this.props.items })
    }
  }

  render() {
    const {
      className,
      labelClassName,
      controlClassName,
      selectItemClassName,

      multi,
      type,
      radioGroupType,
      radioType,
      replaceSelectValues,
      disabled,
      label,
      placeHolder,
      showClearButton,
      children,
      showTextErrors,
      validate,
      errors,
      emptyItemsLabel,
      missingValueResolver,
    } = this.props
    const { items, open, maxHeight } = this.state
    const realSelectedValues = replaceSelectValues

    const isSelected = item => (realSelectedValues).some(el => el === item.value)

    const displayValue = () => {
      if (open && type === SELECT_TYPES.filterDropdown) {
        return (
          <TInput {...{
            'data-cy': `${label}_search`,
            inputClassName: style.search,
            autoFocus: true,
            onSearch: this.onSearch,
          }} />
        )
      }
      if (!realSelectedValues.length && placeHolder) return placeHolder
      if (realSelectedValues.length === 1) {
        const currentItem = items.find(el => el.value === realSelectedValues[0]) || {}
        return currentItem.selectedLabel || currentItem.label || missingValueResolver(realSelectedValues[0])
      }
      return realSelectedValues.length
    }
    const currentErrors = this.props.validate.checkOnBlur && !this.state.wasBlured ? [] : errors
    const hasErrors = !!currentErrors.length
    const errorBlock = showTextErrors && hasErrors && (
      <div className={style.errors}>
        {currentErrors.map((error, index) => (
          <div className={style.errorText} key={index}>
            {error}
          </div>
        ))}
      </div>
    )
    const currentLabel = (
      <TLabel {...{
        className: classNames(labelClassName, style.label),
        required: validate.required,
        label,
      }} />
    )

    if (type === SELECT_TYPES.tile) {
      return (
        <CSSTransitionGroup {...{
          className: classNames(style.tileRootContainer, className),
          transitionName: fadeInWithHeight,
          transitionEnterTimeout: 200,
          transitionLeaveTimeout: 200,
        }}>
          <div className={style.row}>
            {!!label && currentLabel }
            {!open && realSelectedValues.length &&
              <div {...{
                className: style.selectedTile,
                onClick: this.open,
                'data-cy': label || placeHolder,
              }}>
                {displayValue()}
              </div>
            }
          </div>
          {open &&
            <ul className={classNames(style.tileRoot, disabled && style.disabled)}>
              {items.map(item => (
                <li {...{
                  key: item.value,
                  onClick: disabled ? undefined : () => this.select(item.value),
                  'data-cy': item.label || item.value,
                  className: classNames(style.tileItem, isSelected(item) && style.active),
                }} >
                  <span>{item.label || item.value}</span>
                </li>
              ))}
            </ul>
          }
          {errorBlock}
        </CSSTransitionGroup>
      )
    }

    if (type === SELECT_TYPES.radio) {
      return (
        <div {...{
          className: classNames(style.tileRootContainer, className),
          tabIndex: 0,
          onBlur: () => this.setState({ wasBlured: true }),
        }}>
          {!!label && currentLabel }
          <div className={classNames(style.tileRoot, disabled && style.disabled)}>
            {items.map(item => (
              <TRadioButton {...{
                type: radioType,
                key: item.value,
                onChange: disabled ? undefined : () => this.select(item.value),
                'data-cy': item.label || item.value,
                value: isSelected(item),
                label: item.label || item.value,
                className: radioGroupType === RADIO_GROUP_TYPES.vertical ? style.radioVertical : style.radioHorizontal,
              }} >
                <span>{item.label || item.value}</span>
              </TRadioButton>
            ))}
          </div>
          {errorBlock}
        </div>
      )
    }

    if (type === SELECT_TYPES.checkbox || type === SELECT_TYPES.toggle) {
      const SelectComp = type === SELECT_TYPES.checkbox ? TCheckbox : TToggle
      return (
        <div {...{
          className: classNames(style.tileRootContainer, className),
          tabIndex: 0,
          onBlur: () => this.setState({ wasBlured: true }),
        }}>
          {!!label && currentLabel }
          <div className={classNames(style.tileRoot, disabled && style.disabled)}>
            {items.map(item => (
              <SelectComp {...{
                key: item.value,
                onChange: disabled ? undefined : () => this.select(item.value),
                'data-cy': item.label || item.value,
                value: isSelected(item),
                label: item.label || item.value,
                className: classNames(style.radioVertical, selectItemClassName),
              }} >
                <span>{item.label || item.value}</span>
              </SelectComp>
            ))}
          </div>
          {errorBlock}
        </div>
      )
    }

    return (
      <TClickOutside onClick={this.close}>
        <div className={classNames(style.rootWrapper, className)}>
          {!!label && currentLabel }
          <div className={classNames(
            controlClassName,
            style.root,
            hasErrors && style.error,
            disabled && style.disabled,
            open && style.open,
          )}>
            <span {...{
              className: style.content,
              onClick: type === SELECT_TYPES.filterDropdown && open ? undefined : this.open,
              'data-cy': label || placeHolder,
            }}>
              <span className={realSelectedValues.length ? style.input : style.placeholder}>
                {displayValue()}
              </span>
            </span>
            <span className={style.controls}>
              <TIcon {...{
                type: ICONS_TYPES.arrow,
                rotate: open ? ROTATE_TYPES.down : ROTATE_TYPES.up,
                onClick: this.open,
                className: style.arrow,
              }} />
              {showClearButton && !!realSelectedValues.length &&
                <TIcon {...{
                  type: ICONS_TYPES.clear,
                  onClick: this.clear,
                  className: style.clear,
                }} />
              }
            </span>
            <div className={style.border} />
            <div className={open ? style.optionsContainer : style.optionsContainerHide}>
              <ul {...{
                className: style.options,
                ref: (node) => {
                  this.options = node
                },
                style: { maxHeight },
              }}>
                {items.map(item => (
                  <li {...{
                    key: item.value === undefined ? 'undefined' : item.value,
                    onClick: () => this.select(item.value),
                    'data-cy': item.label || item.value,
                    ref: (node) => {
                      this[`option${item.value}`] = node
                    },
                    className: classNames(style.item, isSelected(item) && style.active),
                  }} >
                    {multi &&
                      <TIcon {...{
                        type: ICONS_TYPES.confirm,
                        className: style.check,
                      }} />
                    }
                    <span>{item.label || item.value}</span>
                  </li>
                ))}
                {!items.length && emptyItemsLabel &&
                  <li className={style.empty}>
                    { emptyItemsLabel }
                  </li>
                }
              </ul>
              {!!children &&
                <div className={style.children}>
                  {children}
                </div>
              }
            </div>
          </div>
          {errorBlock}
        </div>
      </TClickOutside>
    )
  }
}

export { SELECT_TYPES } from './constants'

export default TSelect
