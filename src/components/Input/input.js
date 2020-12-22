import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import loadable from '@loadable/component'
import classNames from 'classnames'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import objectHash from 'object-hash'
import deepEqual from 'deep-equal'

import { KEY_CODES, NAVIGATION_KEYS, DISPATCH_DEBOUNCE, SEARCH_DEBOUNCE } from '../internal/constants'
import {
  INPUT_TYPES,
  ROW_HEIGHT,
  INNER_INPUT_TYPES,
  DEFAULT_MAX_ROWS,
  FULL_ZERO_TIME,
  checkTime,
} from './constants'

import Icon, { ICONS_TYPES } from '../Icon'
import Label from '../Label'
import LoadingIndicator from '../LoadingIndicator'

import style from './index.module.css'

const WysiwygEditor = loadable(
  () => import('./Wysiwyg'),
  {
    fallback: (<LoadingIndicator />),
  },
)

const noopFunc = () => {}

const numberTypes = [INPUT_TYPES.moneyNumber, INPUT_TYPES.money, INPUT_TYPES.int, INPUT_TYPES.float]
const decimalTypes = [INPUT_TYPES.moneyNumber, INPUT_TYPES.money, INPUT_TYPES.float]

class Input extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(Object.values(INPUT_TYPES)),
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    label: PropTypes.node,
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.string),
    showTextErrors: PropTypes.bool,
    children: PropTypes.node,

    onChange: PropTypes.func,
    onValid: PropTypes.func,
    onInvalid: PropTypes.func,
    onEnter: PropTypes.func,
    onSearch: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,

    settings: PropTypes.shape({
      formatValue: PropTypes.func.isRequired,
      getValue: PropTypes.func.isRequired,
      checkOnBlur: PropTypes.bool,
      required: PropTypes.bool,
      zeroIsValue: PropTypes.bool,
      maxLen: PropTypes.number,
      minLen: PropTypes.number,
      requiredError: PropTypes.string,
      format: PropTypes.oneOfType([
        PropTypes.instanceOf(RegExp),
        PropTypes.shape({
          regexp: PropTypes.instanceOf(RegExp),
          error: PropTypes.string,
        }),
      ]),
      include: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.instanceOf(RegExp),
      ]),
      exclude: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.instanceOf(RegExp),
      ]),
    }),

    // Only for multi
    minRows: PropTypes.number,
    maxRows: PropTypes.number,
  }

  static defaultProps = {
    type: INPUT_TYPES.text,
    value: '',
    showTextErrors: true,
    onChange: noopFunc,
    onValid: noopFunc,
    onInvalid: noopFunc,
    onEnter: noopFunc,
    onSearch: noopFunc,
    onFocus: noopFunc,
    onBlur: noopFunc,
    settings: {},
    minRows: 1,
    maxRows: DEFAULT_MAX_ROWS,
  }

  static getDerivedStateFromProps(props, state) {
    const {
      type,
      value,
      settings: { formatValue },
    } = props
    let formattedValue = formatValue(value.toString())
    let stateFormatedValue = state.formattedValue
    if (type === INPUT_TYPES.time) {
      formattedValue = `${formattedValue}${FULL_ZERO_TIME.substr(formattedValue.length)}`
      stateFormatedValue = `${stateFormatedValue}${FULL_ZERO_TIME.substr(stateFormatedValue.length)}`
    }
    if (formattedValue === state.prevPropsFormattedValue) return null
    if (numberTypes.includes(type)) {
      stateFormatedValue = stateFormatedValue || '0'
      if (stateFormatedValue.indexOf('-') === 0 && formattedValue.indexOf('-') !== 0) {
        formattedValue = stateFormatedValue // don`t state change on minus zero
      }
      const parts = stateFormatedValue.split(/\u002c|\u002e/)
      const fraction = +(parts[1] || '0')
      if (!fraction) stateFormatedValue = parts[0] // don`t state change on zero fraction
      stateFormatedValue = stateFormatedValue.replace(/^[0\s]*/g, '') || '0'
    }
    if (formattedValue !== stateFormatedValue) {
      return {
        formattedValue,
        prevPropsFormattedValue: formattedValue,
      }
    }
    return {
      prevPropsFormattedValue: formattedValue,
    }
  }

  constructor(props) {
    super(props)
    const {
      value,
      settings: { formatValue },
    } = props

    this.lastValid = true

    this.state = {
      formattedValue: formatValue(value.toString()),
      height: props.minRows * ROW_HEIGHT,
    }

    this.heightChange = this.heightChange.bind(this)
    this.validate = this.validate.bind(this)
    this.handleValidate = debounce(this.handleValidate.bind(this), DISPATCH_DEBOUNCE)
    this.handleChange = this.handleChange.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.changeSelection = this.changeSelection.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handlePaste = this.handlePaste.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)

    this.throttledOnChangeEvent = throttle(this.props.onChange, DISPATCH_DEBOUNCE)
    this.debouncedOnSearchEvent = debounce(this.props.onSearch, SEARCH_DEBOUNCE)
  }

  componentDidMount() {
    this.handleValidate()
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value || objectHash(this.props.settings) !== objectHash(prevProps.settings)) {
      this.handleValidate()
    }
  }

  componentWillUnmount() {
    if (!this.lastValid) {
      this.lastValid = true
      this.props.onValid()
    }
  }

  heightChange() {
    const { shadow } = this
    if (shadow) {
      const { minRows, maxRows } = this.props
      const { height } = this.state
      const maxHeight = (maxRows || minRows) * ROW_HEIGHT
      const minHeight = minRows * ROW_HEIGHT
      let newHeight = shadow.scrollHeight
      newHeight -= newHeight % ROW_HEIGHT // fix for first render

      if (maxHeight >= height) newHeight = Math.min(maxHeight, newHeight)
      newHeight = Math.max(minHeight, newHeight)
      if (height !== newHeight) this.setState({ height: newHeight })
    }
  }

  validate() {
    const {
      type,
      value,
      settings: {
        format,
        required,
        zeroIsValue,
        requiredError,
        minLen,
        maxLen,
      },
    } = this.props

    // Required validation, overrides all other errors
    if (required) {
      if (/^\s*$/.test(value)) {
        return [requiredError || 'Value is required'] // TODO i18n
      }
      if (numberTypes.includes(type) && !zeroIsValue) {
        if (value === 0 || value === '0') {
          return [requiredError || 'Value is required'] // TODO i18n
        }
      }
    }

    const errors = []

    const regexpToMatch = (format && format.regexp) || format
    if (value && regexpToMatch && !regexpToMatch.test(value)) {
      errors.push(format.error || 'Incorrect format') // TODO i18n
    }

    if (maxLen && value.length > maxLen) {
      errors.push(`Max length: ${maxLen}`) // TODO i18n
    }

    if (minLen && (required || value.length > 0) && value.length < minLen) {
      errors.push(`Min length: ${minLen}`) // TODO i18n
    }

    return errors
  }

  handleValidate() {
    const {
      value,
      errors,
      onValid,
      onInvalid,
    } = this.props
    const validateErrors = this.validate(value)
    if (validateErrors && validateErrors.length) {
      this.lastValid = false
      if (!deepEqual(errors, validateErrors)) onInvalid(validateErrors)
    } else if (!this.lastValid) {
      this.lastValid = true
      onValid()
    }
  }

  handleChange(e) {
    const {
      type,
      value,
      settings: {
        include,
        exclude,
        getValue,
        formatValue,
      },
    } = this.props
    const { formattedValue } = this.state
    let { value: targetValue } = e.target
    if (include) {
      let targetValueArray = [...targetValue]
      if (Array.isArray(include)) {
        targetValueArray = targetValueArray.map(char => {
          if (!include.includes(char)) return ''
          return char
        })
      }
      if (include instanceof RegExp) {
        targetValueArray = targetValueArray.map(char => {
          if (!include.test(char)) return ''
          return char
        })
      }
      targetValue = targetValueArray.join('')
    }
    if (exclude) {
      let targetValueArray = [...targetValue]
      if (Array.isArray(exclude)) {
        targetValueArray = targetValueArray.map(char => {
          if (exclude.includes(char)) return ''
          return char
        })
      }
      if (exclude instanceof RegExp) {
        targetValueArray = targetValueArray.map(char => {
          if (exclude.test(char)) return ''
          return char
        })
      }
      targetValue = targetValueArray.join('')
    }
    let newFormattedValue = formatValue(targetValue)
    if (type === INPUT_TYPES.time) {
      const isValid = checkTime(newFormattedValue)
      if (!isValid) {
        e.preventDefault()
        return false
      }
    }
    if (decimalTypes.includes(type)) {
      const formatedValueAbs = formattedValue.replace('-', '')
      const newFormatedValueAbs = +(newFormattedValue.replace(/\D/g, '') || 0)
      if (formatedValueAbs === '0') {
        newFormattedValue = newFormattedValue.replace(/\d+/, newFormatedValueAbs)
      }
    }
    this.setState({
      caretPosition: this.selectionStart,
      formattedValue: newFormattedValue,
    }, () => {
      let newValue
      if (newFormattedValue !== '') {
        newValue = getValue(newFormattedValue)
      }
      this.throttledOnChangeEvent(newValue)
      if (value !== newValue) {
        this.debouncedOnSearchEvent(newValue)
      }
    })
    return true
  }

  handleSelect(e) {
    if (!e.key || NAVIGATION_KEYS.includes(e.key)) {
      this.selectionStart = e.target.selectionStart
      this.selectionEnd = e.target.selectionEnd
    }
  }

  changeSelection(delta = 0, additional = '') {
    const { formattedValue } = this.state
    const { type, settings: { getValue, formatValue } } = this.props
    const splitFormattedValue = `${formattedValue.substr(0, this.selectionStart - delta)}${additional}`
    let newSplitFormattedValue = formatValue(splitFormattedValue)
    if (numberTypes.includes(type)) {
      const splitValue = getValue(splitFormattedValue, false)
      const splitValueLength = splitValue.length
      const newFormattedValue = formatValue(`${splitFormattedValue}${formattedValue.substr(this.selectionStart)}`)
      newSplitFormattedValue = newFormattedValue.substr(0, splitValueLength)
      let i = 0
      while (getValue(newSplitFormattedValue, false).length < splitValueLength) {
        i += 1
        newSplitFormattedValue = newFormattedValue.substr(0, splitValueLength + i)
      }
      const lastOfSplitFormattedValue = splitFormattedValue[splitFormattedValue.length - 1]
      if (/[\u002c\u002e]/.test(lastOfSplitFormattedValue)) newSplitFormattedValue += lastOfSplitFormattedValue
    }
    this.selectionStart = newSplitFormattedValue.length
    this.selectionEnd = newSplitFormattedValue.length
  }

  handleKeyDown(e) {
    if (e.key === KEY_CODES.enter) {
      const { getValue } = this.props.settings
      const value = getValue(this.state.formattedValue)
      this.handleBlur()
      this.props.onEnter()
      this.props.onSearch(value)
    }
  }

  handleInput(e) {
    if (((e.inputType === 'insertLineBreak' || e.key === KEY_CODES.enter) && this.props.type === INPUT_TYPES.multi)
      || e.data) {
      const char = e.data || '\r'
      const {
        type,
        settings: {
          include,
          exclude,
          getValue,
          formatValue,
        },
      } = this.props
      const { formattedValue } = this.state
      let shouldPreventDefault = false
      if (numberTypes.includes(type)) {
        shouldPreventDefault = char === '-' && (this.selectionStart !== 0 || formattedValue.includes('-'))
        shouldPreventDefault += (char === '.' || char === ',') && formattedValue.includes(',')
        const roundValue = Math.floor(getValue(formattedValue)).toString()
        const roundFormattedValue = formatValue(roundValue)
        shouldPreventDefault += roundValue.length >= Number.MAX_SAFE_INTEGER.toString().length - 1 &&
          this.selectionStart === this.selectionEnd &&
          !(char === '.' || char === ',') &&
          this.selectionStart <= roundFormattedValue.length
      }
      if (include) {
        shouldPreventDefault += (Array.isArray(include) ? !include.includes(char) : !include.test(char))
        if (exclude) {
          shouldPreventDefault += (Array.isArray(exclude) ? exclude.includes(char) : exclude.test(char))
        }
      } else if (exclude) {
        shouldPreventDefault += (Array.isArray(exclude) ? exclude.includes(char) : exclude.test(char))
      }
      if (shouldPreventDefault) {
        e.preventDefault()
      } else {
        this.changeSelection(0, char)
      }
    } else if (e.inputType === 'deleteContentBackward' || e.key === KEY_CODES.backspace) {
      const delta = +(this.selectionStart === this.selectionEnd)
      this.changeSelection(delta)
    }
  }

  handlePaste(e) {
    const pastedText = e.clipboardData.getData('text')
    this.changeSelection(0, pastedText)
  }

  handleFocus() {
    this.setState({ active: true })
    this.props.onFocus()
  }

  handleBlur() {
    this.setState({ wasBlured: true, active: false })
    this.props.onBlur()
  }

  render() {
    const {
      dataAttributes,
      className,
      labelClassName,
      inputClassName,
      type,
      disabled,
      autoFocus,
      placeholder,
      label,
      errors,
      showTextErrors,
      children,
      settings: {
        required,
        checkOnBlur,
      },
    } = this.props

    const {
      formattedValue,
      height,
      wasBlured,
      active,
      caretPosition,
    } = this.state

    const inputProps = {
      ref: (node) => {
        if (!this.input && node) {
          node.addEventListener('input', this.handleInput)
          // props onPress call it with short event argument
        }
        this.input = node
        if (node) {
          this.inputWidth = node.offsetWidth
        }
        if (node && caretPosition !== undefined && active) {
          node.setSelectionRange(caretPosition, caretPosition)
        }
      },
      'data-cy': label || placeholder,
      placeholder,
      disabled,
      autoFocus,
      value: formattedValue,
      onChange: this.handleChange,
      onSelect: this.handleSelect,
      onClick: this.handleSelect,
      onKeyUp: this.handleSelect,
      onKeyDown: this.handleKeyDown,
      onPaste: this.handlePaste,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
    }

    let currentErrors = errors
    if ((checkOnBlur && !wasBlured) || !Array.isArray(currentErrors)) {
      currentErrors = []
    }

    const getInputComp = () => {
      switch (type) {
        case INPUT_TYPES.wysiwyg:
          return (
            <WysiwygEditor {...{
              ...inputProps,
              ref: undefined,
            }} />
          )
        case INPUT_TYPES.multi:
          return (
            <textarea {...{
              className: classNames(style.textarea, disabled && style.disabled),
              style: {
                lineHeight: `${ROW_HEIGHT}px`,
                height,
              },
              ...inputProps,
            }} />
          )
        default:
          return (
            <input {...{
              type: INNER_INPUT_TYPES[type],
              className: classNames(style.input, disabled && style.disabled),
              ...inputProps,
            }} />
          )
      }
    }

    return (
      <div className={classNames(
        style.rootWrapper,
        className,
      )}>
        {
          label &&
          <Label {...{
            className: classNames(labelClassName, style.label),
            required,
            label,
          }} />
        }
        <div {...dataAttributes} className={classNames(
          style.root,
          inputClassName,
          {
            [style.error]: currentErrors.length > 0,
            [style.active]: active,
          },
        )}>
          {
            (type === INPUT_TYPES.phone || type === INPUT_TYPES.phoneWithExt) &&
            <span className={style.phoneCode}>+</span>
          }
          {
            type === INPUT_TYPES.search &&
            <Icon {...{
              className: style.phoneCode,
              type: ICONS_TYPES.search,
              size: 20,
            }} />
          }
          {
            type === INPUT_TYPES.url &&
            <span className={style.phoneCode}>http://</span>
          }
          {
            type === INPUT_TYPES.multi &&
            <textarea {...{
              ref: (node) => {
                this.shadow = node
                this.heightChange()
              },
              className: style.shadow,
              style: {
                height: 0,
                width: this.inputWidth,
                lineHeight: `${ROW_HEIGHT}px`,
              },
              value: formattedValue,
              tabIndex: -1,
              readOnly: true,
            }} />
          }
          {getInputComp()}
          {children}
        </div>
        {
          showTextErrors &&
          <div className={style.errors}>
            {currentErrors.map((error, index) => (
              <div className={style.errorText} key={index}>
                {error}
              </div>
            ))}
          </div>
        }
      </div>
    )
  }
}

export default Input
