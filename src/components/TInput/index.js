import deepEqual from 'deep-equal'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import React, { PureComponent } from 'react'
import union from 'lodash/union'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

import { KEY_CODES, DISPATCH_DEBOUNCE, SEARCH_DEBOUNCE, DEFAULT_PHONE_LENGTH } from '$trood/mainConstants'
import {
  VALIDATION_FORMATS,
  INPUT_TYPES,
  ERROR_TYPES,
  formatToFunctions,
  formatFromFunctions,
  includeForTypes,
  excludeForTypes,
  ROW_HEIGHT,
  INNER_INPUT_TYPES,
  DEFAULT_MAX_ROWS,
  checkTime,
} from './constants'

import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'
import TLabel from '$trood/components/TLabel'
import WysiwygEditor from '$trood/components/WysiwygEditor'

import style from './index.css'


const noopFunc = () => {}

class TInput extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    replaceValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    greedyFocus: PropTypes.bool, // Stops propagation for input mouse event
    type: PropTypes.oneOf(Object.values(INPUT_TYPES)),
    autoFocus: PropTypes.bool,
    newLineOnCtrlEnter: PropTypes.bool,
    disabled: PropTypes.bool,
    errors: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.object,
    ]),
    showTextErrors: PropTypes.bool,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onInvalid: PropTypes.func,
    onValid: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnter: PropTypes.func,
    onKeyDown: PropTypes.func,
    onHeightChange: PropTypes.func,
    placeholder: PropTypes.string,
    tooltip: PropTypes.string,
    label: PropTypes.node,
    include: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.instanceOf(RegExp),
    ]),
    exclude: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.instanceOf(RegExp),
    ]),
    validate: PropTypes.shape({
      checkOnBlur: PropTypes.bool,
      required: PropTypes.bool,
      maxLen: PropTypes.number,
      minLen: PropTypes.number,
      format: PropTypes.oneOfType([
        PropTypes.instanceOf(RegExp),
        PropTypes.shape({
          regexp: PropTypes.instanceOf(RegExp),
          error: PropTypes.string,
        }),
      ]),
    }),
    innerInputProps: PropTypes.object,

    // Only for multi
    minRows: PropTypes.number,
    maxRows: PropTypes.number,

    // Only for number
    min: PropTypes.number,
    max: PropTypes.number,
  }

  static defaultProps = {
    className: '',
    labelClassName: '',
    defaultValue: '',
    greedyFocus: false,
    type: 'text',
    disabled: false,
    newLineOnCtrlEnter: false,
    errors: [],
    showTextErrors: true,
    onChange: noopFunc,
    onSearch: noopFunc,
    onInvalid: noopFunc,
    onValid: noopFunc,
    onFocus: noopFunc,
    onBlur: noopFunc,
    onKeyDown: noopFunc,
    onEnter: noopFunc,
    onHeightChange: noopFunc,
    placeholder: '',
    validate: {},
    minRows: 1,
    maxRows: DEFAULT_MAX_ROWS,
  }

  constructor(props, context) {
    super(props, context)

    this.handleChange = this.handleChange.bind(this)
    this.handleHeightChange = this.handleHeightChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.defineValidate = this.defineValidate.bind(this)
    this.defineFormat = this.defineFormat.bind(this)
    this.defineIncludeAndExclude = this.defineIncludeAndExclude.bind(this)
    this.validate = this.validate.bind(this)
    this.setValue = this.setValue.bind(this)
    this.onValueUpdate = this.onValueUpdate.bind(this)
    this.onValidationUpdate = this.onValidationUpdate.bind(this)
    this.blur = this.blur.bind(this)

    this.calculateInnerSettings()

    this.onInvalidFired = undefined
    this.throttledOnChangeEvent = throttle((...args) => this.props.onChange(...args), DISPATCH_DEBOUNCE)
    this.debouncedOnSearchEvent = debounce((...args) => this.props.onSearch(...args), SEARCH_DEBOUNCE)

    this.state = {
      innerErrors: [],
      value: '',
      wasBlured: false,
      caretPosition: 0,
      height: this.props.minRows * ROW_HEIGHT,
    }
  }

  componentDidMount() {
    const {
      defaultValue,
      minRows,
      maxRows,
      type,
    } = this.props

    this.setValue(defaultValue) // For validation

    // Some workaround for newly initialized modals with MULTI input not animate
    // For some reason calling element.scrollHeight affects top-level aminations...
    // So we dismiss cases, when this check is not needed
    // TODO by @deylak use some other animation library, or at least rework modals animations
    if (type === INPUT_TYPES.multi && defaultValue && minRows !== maxRows) {
      this.handleHeightChange(defaultValue)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.minRows !== this.props.minRows) {
      this.setState({
        height: Math.max(nextProps.minRows * ROW_HEIGHT, this.state.height),
      })
    }
    if (nextProps.replaceValue !== undefined && nextProps.replaceValue !== this.getValue()) {
      this.setValue(nextProps.replaceValue)
    }
    if (this.props.type !== nextProps.type || !deepEqual(nextProps.validate, this.props.validate)) {
      this.setState({
        innerErrors: [],
      }, () => {
        this.calculateInnerSettings(nextProps)
        this.handleChange({
          target: {
            value: this.formatTo(nextProps.replaceValue),
          },
        })
      })
    }
  }

  onValidationUpdate() {
    const { disabled } = this.props
    const { innerErrors } = this.state

    if (!disabled) {
      if (innerErrors.length) {
        this.props.onInvalid(innerErrors, this.getValue())
        this.onInvalidFired = true
      } else if (this.onInvalidFired || this.onInvalidFired === undefined) {
        this.props.onValid()
        this.onInvalidFired = false
      }
    }
  }

  onValueUpdate(newCaretPosition) {
    if (this.props.type !== INPUT_TYPES.wysiwyg) {
      if (newCaretPosition !== undefined) {
        this.input.setSelectionRange(newCaretPosition, newCaretPosition)
      } else {
        this.input.setSelectionRange(this.input.selectionStart, this.input.selectionStart)
      }

      if (this.props.newLineOnCtrlEnter && newCaretPosition === this.state.value.length) {
        const { input } = this
        input.scrollTop = input.scrollHeight // TODO scroll to carret position
      }
    }

    this.onValidationUpdate()
  }

  setValue(value, caretPosition, initialValue) {
    const innerErrors = this.validate(value)
    const formatted = this.formatTo(value)
    let newCaretPosition
    if (caretPosition !== undefined && initialValue && this.state.value !== formatted) {
      const diff = initialValue.length - formatted.length
      newCaretPosition = caretPosition - diff
      newCaretPosition = newCaretPosition < 0 ? 0 : newCaretPosition
    }
    const setStateObj = {
      value: formatted,
      innerErrors,
    }
    if (newCaretPosition !== undefined) {
      setStateObj.caretPosition = newCaretPosition
    }
    this.setState(setStateObj, () => this.onValueUpdate(newCaretPosition))
  }

  getValue() {
    return this.formatFrom(this.state.value)
  }

  getErrors() {
    const { errors } = this.props
    const { innerErrors } = this.state
    return errors ? innerErrors.concat(errors) : innerErrors
  }

  blur() {
    if (this.input) {
      this.input.blur()
    }
  }

  defineValidate(props = this.props) {
    const validateRegexp = VALIDATION_FORMATS[props.type]
    const defaultValidate = {
      format: !validateRegexp ? undefined : {
        regexp: validateRegexp,
        error: ERROR_TYPES[props.type],
      },
      maxLen: props.validate.maxLen,
      minLen: props.validate.minLen,
      required: props.validate.required,
    }
    if (props.validate.format) {
      defaultValidate.format = props.validate.format
    }
    if (props.type === INPUT_TYPES.phone) {
      defaultValidate.minLen = defaultValidate.minLen || DEFAULT_PHONE_LENGTH
    }

    this.validateObj = defaultValidate
  }

  defineFormat(props = this.props) {
    this.formatTo = formatToFunctions[props.type] || (val => val)
    this.formatFrom = formatFromFunctions[props.type] || (val => val)
  }

  defineIncludeAndExclude(props = this.props) {
    this.include = includeForTypes[props.type] || props.include
    this.exclude = excludeForTypes[props.type] || props.exclude
  }

  calculateInnerSettings(props = this.props) {
    this.defineValidate(props)
    this.defineFormat(props)
    this.defineIncludeAndExclude(props)
  }

  validate(value) {
    const errors = []

    // Required validation, overrides all other errors
    if (this.props.validate.required && /^\s*$/.test(value)) {
      errors.push(this.props.validate.requiredError || ERROR_TYPES.required)
      return errors
    }

    // RegExp validation
    const regexpToMatch = this.validateObj.format ?
      this.validateObj.format.regexp || this.validateObj.format :
      undefined
    if (regexpToMatch && !regexpToMatch.test(value)) {
      errors.push(this.validateObj.format.error || ERROR_TYPES.format)
    }

    const {
      maxLen,
      minLen,
    } = this.validateObj
    // MaxLen validation
    if (maxLen && value.length > maxLen) {
      errors.push(ERROR_TYPES.maxLen + maxLen)
    }

    // MinLen validation
    if (minLen && (this.props.validate.required || value.length > 0) && value.length < minLen) {
      errors.push(ERROR_TYPES.minLen + minLen)
    }

    return errors
  }

  handleKeyPress(e) {
    let shouldPreventDefault = false
    if (this.props.type === INPUT_TYPES.money) {
      shouldPreventDefault = (e.key === '.' || e.key === ',') && this.state.value.includes(',')
    }
    if (this.props.type === INPUT_TYPES.number) {
      shouldPreventDefault = e.key === '-' && !!this.state.value.length
    }
    if (this.exclude && !this.include) {
      shouldPreventDefault = shouldPreventDefault ||
        (Array.isArray(this.exclude) ? this.exclude.includes(e.key) : this.exclude.test(e.key))
    }
    if (this.include) {
      shouldPreventDefault = shouldPreventDefault ||
        (Array.isArray(this.include) ? !this.include.includes(e.key) : !this.include.test(e.key))
    }
    if (shouldPreventDefault) {
      e.preventDefault()
    }
  }

  handleBlur(e) {
    this.setState({
      wasBlured: true,
      active: false,
    }, () => {
      if (this.props.validate.checkOnBlur) {
        const innerErrors = this.validate(this.getValue())
        this.setState({
          innerErrors: union(this.props.errors, innerErrors),
        }, () => this.onValidationUpdate())
      }
    })
    if (e) {
      this.props.onBlur(e)
    }
  }

  handleFocus(e) {
    this.setState({ active: true })
    this.props.onFocus(e)
  }

  handleKeyDown(e) {
    if (this.props.greedyFocus) {
      if (e.key === ' ') {
        // Some insane hack for issue with react-beatiful-dnd pressing space and onChange fired with dot symbol
        this.revertDotChange = true
      }
      e.stopPropagation()
    }
    if (this.props.newLineOnCtrlEnter && this.props.type === INPUT_TYPES.multi && e.keyCode === KEY_CODES.enter) {
      e.preventDefault()
      if (e.ctrlKey) {
        const {
          input: {
            selectionStart,
            selectionEnd,
          },
        } = this
        const { value } = this.state
        const firstValue = value.substr(0, selectionStart)
        const lastValue = value.substr(selectionEnd)
        const newValue = `${firstValue}\n${lastValue}`
        this.handleChange({
          target: {
            selectionStart: selectionStart + 1,
            value: newValue,
          },
        })
      }
    }
    this.props.onKeyDown(e)
    if (e.keyCode === KEY_CODES.enter) {
      this.handleBlur()
      this.props.onEnter()
      this.props.onSearch(this.getValue())
    }
  }

  handleHeightChange(value) {
    const { shadow } = this
    shadow.value = value
    const maxHeight = (this.props.maxRows || this.props.minRows) * ROW_HEIGHT
    const minHeight = this.props.minRows * ROW_HEIGHT
    let newHeight = shadow.scrollHeight

    if (maxHeight >= this.state.height) {
      newHeight = Math.min(maxHeight, newHeight)
    }
    newHeight = Math.max(minHeight, newHeight)

    if (this.state.height !== newHeight) {
      this.setState({
        height: newHeight,
      }, () => this.props.onHeightChange(this.state.height))
    }
  }

  handleChange(e) {
    const { type } = this.props
    let value = this.formatFrom(e.target.value)
    if (this.revertDotChange && value[value.length - 2] === '.') {
      value = `${value.slice(0, -2)} `
    }
    this.revertDotChange = false
    if (type === INPUT_TYPES.time && !checkTime(value)) {
      e.preventDefault()
      return
    }
    if (type === INPUT_TYPES.number || type === INPUT_TYPES.moneyNumber) {
      const {
        min,
        max,
      } = this.props
      if (min !== undefined && value < min) value = min
      if (max !== undefined && value > max) value = max
    }
    this.throttledOnChangeEvent(value)
    this.debouncedOnSearchEvent(value)
    if (
      (type === INPUT_TYPES.money || type === INPUT_TYPES.moneyNumber) &&
      (e.target.value.endsWith(',') || e.target.value.endsWith('.'))
    ) {
      value = `${value},`
    }
    if (type === INPUT_TYPES.multi) {
      this.handleHeightChange(value)
    }
    this.setValue(value, e.target.selectionStart, e.target.value)
  }

  render() {
    const {
      type,
      className,
      labelClassName,
      inputClassName,
      disabled,
      greedyFocus,
      placeholder,
      label,
      errors,
      showTextErrors,
      autoFocus,
      children,
      validate,
      innerInputProps,
    } = this.props

    const {
      value,
      height,
      wasBlured,
      active,
      caretPosition,
    } = this.state

    const inputProps = {
      ref: (node) => {
        this.input = node
        if (node && caretPosition !== undefined) {
          node.setSelectionRange(caretPosition, caretPosition)
        }
      },
      placeholder: value ? undefined : placeholder,
      disabled,
      value: value || '',
      autoFocus,
      onMouseDown: greedyFocus ? (e => e.stopPropagation()) : undefined,
      onKeyPress: this.handleKeyPress,
      onChange: this.handleChange,
      onKeyDown: this.handleKeyDown,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      ...innerInputProps,
    }

    this.calculateInnerSettings()

    let currentErrors = errors
    if (this.props.validate.checkOnBlur && !wasBlured || !Array.isArray(currentErrors)) {
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
              className: style.textarea,
              style: {
                lineHeight: `${ROW_HEIGHT - 1}px`,
                height,
              },
              ...inputProps,
            }} />
          )
        default:
          return (
            <input {...{
              type: INNER_INPUT_TYPES[type],
              className: style.input,
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
        {label &&
          <TLabel {...{
            className: classNames(labelClassName, style.label),
            required: validate.required,
            label,
          }} />
        }
        <div className={classNames(
          style.root,
          inputClassName,
          {
            [style.error]: currentErrors.length > 0,
            [style.active]: active,
          },
        )}>
          {type === INPUT_TYPES.phone &&
            <span className={style.phoneCode}>
              +7
            </span>
          }
          {type === INPUT_TYPES.search &&
            <TIcon {...{
              className: style.phoneCode,
              type: ICONS_TYPES.search,
              size: 20,
            }} />
          }
          {type === INPUT_TYPES.url &&
            <span className={style.phoneCode}>
              http://
            </span>
          }
          {type === INPUT_TYPES.multi &&
            <textarea {...{
              ref: (node) => {
                this.shadow = node
              },
              className: style.shadow,
              style: {
                lineHeight: `${ROW_HEIGHT}px`,
              },
              value: value || '',
              tabIndex: -1,
              readOnly: true,
            }} />
          }
          {getInputComp()}
          {children}
        </div>
        {showTextErrors &&
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

export { INPUT_TYPES } from './constants'

export default TInput
