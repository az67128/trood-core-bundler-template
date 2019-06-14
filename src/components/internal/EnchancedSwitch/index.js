import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import { INNER_INPUT_TYPES, LABEL_POSITION_TYPES } from './constants'

import { messages } from '$trood/mainConstants'
import { intlObject } from '$trood/localeService'


class EnchancedSwitch extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    disabledLabelClassName: PropTypes.string,

    type: PropTypes.oneOf(Object.values(INNER_INPUT_TYPES)),
    disabled: PropTypes.bool,
    stopPropagation: PropTypes.bool,

    switched: PropTypes.bool.isRequired,
    switchedComponent: PropTypes.node.isRequired,
    unSwitchedComponent: PropTypes.node,
    label: PropTypes.node,
    labelPosition: PropTypes.oneOf(Object.values(LABEL_POSITION_TYPES)),
    secondLabel: PropTypes.node,
    secondLabelPosition: PropTypes.oneOf(Object.values(LABEL_POSITION_TYPES)),

    errors: PropTypes.arrayOf(PropTypes.node),
    showTextErrors: PropTypes.bool,
    validate: PropTypes.shape({
      checkOnBlur: PropTypes.bool,
      required: PropTypes.bool,
    }),

    onChange: PropTypes.func,
    onValid: PropTypes.func,
    onInvalid: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    stopPropagation: false,
    className: '',
    labelClassName: '',
    disabledLabelClassName: '',
    type: INNER_INPUT_TYPES.checkbox,
    labelPosition: LABEL_POSITION_TYPES.right,
    secondLabelPosition: LABEL_POSITION_TYPES.left,
    errors: [],
    showTextErrors: true,
    validate: {},

    onChange: () => {},
    onValid: () => {},
    onInvalid: () => {},
  }

  constructor(props) {
    super(props)

    this.validate = this.validate.bind(this)
    this.onValidationUpdate = this.onValidationUpdate.bind(this)

    this.state = {
      innerErrors: [],
      wasBlured: false,
    }
  }

  componentDidMount() {
    this.validate(this.props.switched)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.switched !== this.props.switched) {
      this.validate(nextProps.switched)
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

  validate(value) {
    const innerErrors = this.props.validate.required && !value ?
      [intlObject.intl.formatMessage(messages.requiredField)] : []
    this.setState({ innerErrors }, this.onValidationUpdate)
  }

  render() {
    const {
      className,
      labelClassName,
      disabledLabelClassName,
      disabled,
      stopPropagation,
      type,
      switched,
      switchedComponent,
      unSwitchedComponent,
      label,
      secondLabel,
      labelPosition,
      secondLabelPosition,
      errors,
      showTextErrors,

      onChange,
    } = this.props

    const currentErrors = this.props.validate.checkOnBlur && !this.state.wasBlured ? [] : errors

    return (
      <div {...{
        tabIndex: 0,
        className: classNames(style.root, className, disabled && style.disabled),
        'data-cy': label,
        onClick: !disabled && ((e) => {
          if (stopPropagation) {
            e.stopPropagation()
          }
          onChange(!switched)
        }),
        onBlur: !disabled && (() => this.setState({ wasBlured: true })),
        onFocus: !disabled && (() => this.setState({ wasBlured: false })),
      }} >
        <input {...{
          type,
          disabled,
          className: style.innerInput,
          checked: switched,
          onChange: () => {}, // suppress react warning
        }} />
        {label &&
          <label
            className={classNames(
              labelPosition === LABEL_POSITION_TYPES.right ? style.labelRight : style.labelLeft,
              labelClassName,
              disabled && style.disabledLabel,
              disabled && disabledLabelClassName,
            )}
          >
            {label}
          </label>
        }
        {secondLabel &&
          <label
            className={classNames(
              secondLabelPosition === LABEL_POSITION_TYPES.right ? style.labelRight : style.labelLeft,
              labelClassName,
              disabled && style.disabledLabel,
              disabled && disabledLabelClassName,
            )}
          >
            {secondLabel}
          </label>
        }
        <div className={style.component}>
          {switched && switchedComponent}
          {!switched && (unSwitchedComponent || switchedComponent)}
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

export default EnchancedSwitch
