import React, { PureComponent } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import deepEqual from 'deep-equal'

import style from './index.css'

import TClickOutside from '$trood/components/TClickOutside'
import TIcon, { ICONS_TYPES, ROTATE_TYPES } from '$trood/components/TIcon'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import TButton, { BUTTON_TYPES, BUTTON_COLORS } from '$trood/components/TButton'

import { PICKER_TYPES, PICKER_ERRORS } from './constants'


const getDateTimeFormat = type => {
  switch (type) {
    case PICKER_TYPES.dateTime:
      return 'DD.MM.YYYY HH:mm'
    case PICKER_TYPES.date:
      return 'DD.MM.YYYY'
    default:
      return 'DD.MM.YYYY HH:mm'
  }
}

const returnFormat = 'YYYY-MM-DD[T]HH:mm:00ZZ'

class DateTimePicker extends PureComponent {
  static defaultProps = {
    type: PICKER_TYPES.dateTime,
    validate: {},
    onChange: () => {},
    onValid: () => {},
    onInvalid: () => {},
  }

  constructor(props) {
    super(props)

    this.state = {
      value: props.value,
      timeValue: props.value ? moment(props.value).format('HHmm') : '',
      innerErrors: [],
    }

    this.toggleOpen = this.toggleOpen.bind(this)
    this.changeValue = this.changeValue.bind(this)
    this.sendOnChange = this.sendOnChange.bind(this)
    this.validate = this.validate.bind(this)
  }

  componentDidMount() {
    this.validate(this.props.validate)
  }

  componentWillReceiveProps(nextProps) {
    const validateChanged = !deepEqual(this.props.validate, nextProps.validate)
    let { value } = this.state
    if (typeof this.props.value !== typeof nextProps.value) {
      this.setState({
        timeValue: nextProps.value === undefined ? '' : moment(nextProps.value).format('HHmm'),
      })
    }
    if (value !== nextProps.value &&
      moment(value).format(returnFormat) !== moment(nextProps.value).format(returnFormat)) {
      value = nextProps.value
      this.setState({ value }, () => this.validate(nextProps.validate))
    } else if (validateChanged) {
      this.validate(nextProps.validate)
    }
  }

  componentWillUnmount() {
    this.props.onValid()
  }

  sendOnChange(date, type) {
    if (date) {
      this.props.onChange(moment(date), type)
    } else {
      this.props.onChange(undefined, type)
    }
  }

  validate(validate) {
    const innerErrors = []
    if (!this.state.value) {
      if (validate.required) innerErrors.push(PICKER_ERRORS.required)
    } else if (validate.minDate && moment(this.state.value).isBefore(validate.minDate) ||
      validate.maxDate && moment(this.state.value).isAfter(validate.maxDate)
    ) {
      innerErrors.push(PICKER_ERRORS.outOfRange)
    }
    this.setState({ innerErrors })
    if (innerErrors.length) {
      this.props.onInvalid(innerErrors)
    } else {
      this.props.onValid()
    }
  }

  toggleOpen(open) {
    let newOpen = open
    let { value } = this.state
    if (newOpen === undefined) newOpen = !this.state.open
    if (newOpen && !value) value = this.props.validate.minDate || moment().format(returnFormat)
    const afterSetState = this.state.open && !newOpen ?
      () => {
        this.validate(this.props.validate)
        this.setState({ wasBlured: true })
        this.sendOnChange(value, 'date')
      }
      :
      () => {}
    this.setState({ open: newOpen, value }, afterSetState)
  }

  changeValue(value, type) {
    let {
      value: newValue,
      timeValue,
    } = this.state
    if (type === 'date') {
      newValue = moment(newValue).format(`${moment(value).format('YYYY-MM-DD')}[T]HH:mm:00ZZ`)
    } else if (type === 'time') {
      timeValue = value
      const fullTimeValue = timeValue.concat('0000'.slice(0, 4 - timeValue.length))
      newValue = moment(newValue).set({
        hour: fullTimeValue.slice(0, 2),
        minute: fullTimeValue.slice(2),
      }).format(returnFormat)
    } else {
      newValue = moment(newValue).set({ [type]: value }).format(returnFormat)
    }
    this.setState({
      value: newValue,
      timeValue,
    }, () => {
      if (type === 'time') {
        this.validate(this.props.validate)
        this.sendOnChange(this.state.value)
      }
    })
  }

  render() {
    const {
      type,
      disabled,
      validate,
      placeHolder,
      className,
    } = this.props
    const {
      value,
      innerErrors,
      open,
      wasBlured,
    } = this.state

    const firstWeek = moment(value).startOf('month').week()
    let lastWeek = moment(value).endOf('month').week()
    if (lastWeek < firstWeek) {
      let lastWeekOfYear = moment(value).endOf('year').week()
      if (lastWeekOfYear === 1) {
        lastWeekOfYear = moment(value).endOf('year').add({ week: -1 }).week()
      }
      lastWeek += lastWeekOfYear
    }
    const weekInMonth = lastWeek - firstWeek + 1

    const startOfMonth = moment(value).startOf('month')
    const startOfFirstMonthWeek = startOfMonth.startOf('week')

    let calendarArray = (new Array(weekInMonth)).fill((new Array(7)).fill(0))

    let day = -1
    calendarArray = calendarArray.map(weekItem => weekItem.map(() => {
      day += 1
      return moment(startOfFirstMonthWeek).add({ day }).format(returnFormat)
    }))
    const calendarFirstWeek = calendarArray[0]

    const isCellDisabled = date => {
      if (validate.minDate && moment(validate.minDate).startOf('day').isAfter(date) ||
        validate.maxDate && moment(validate.maxDate).endOf('day').isBefore(date)) return true
      return false
    }
    let timePicker
    if (type !== PICKER_TYPES.date) {
      timePicker = (
        <TInput {...{
          className: classNames(
            style.timeTInput,
            type === PICKER_TYPES.time && className,
          ),
          disabled,
          type: INPUT_TYPES.time,
          placeholder: '00:00',
          value: this.state.timeValue,
          errors: innerErrors,
          onChange: v => this.changeValue(v, 'time'),
          onValid: () => this.setState({ innerErrors: [] }),
          onInvalid: err => this.setState({ innerErrors: err }),
          showTextErrors: false,
          validate: {
            checkOnBlur: !validate.checkBeforeBlur,
            requaired: validate.requaired,
          },
        }} />
      )
    }
    if (type === PICKER_TYPES.time) {
      return timePicker
    }

    return (
      <TClickOutside onClick={() => this.toggleOpen(false)}>
        <div {...{
          className: classNames(
            style.root,
            className,
            disabled && style.disabled,
            open && style.open,
            (validate.checkBeforeBlur || wasBlured) && innerErrors.length && style.error,
          ),
          'data-cy': placeHolder,
        }}>
          <div {...{
            className: style.header,
            onClick: disabled ? () => {} : () => this.toggleOpen(),
            'data-cy': 'dateTimePickerControl',
          }}>
            {value &&
              <div className={style.value}>
                {moment(value).format(getDateTimeFormat(type))}
              </div>
              ||
              <span>{placeHolder}</span>
            }
            <TIcon {...{
              size: 28,
              type: ICONS_TYPES.triangleArrow,
              rotate: open ? ROTATE_TYPES.up : ROTATE_TYPES.down,
              className: style.icon,
            }} />
          </div>
          {open &&
          <div className={classNames(style.body, style[type])}>
            <div className={style.bodyHeader}>
              <TIcon {...{
                type: ICONS_TYPES.arrowWithTail,
                size: 40,
                className: style.calendarArrow,
                onClick: () => this.changeValue(moment(value).month() - 3, 'month'),
              }} />
              {(new Array(3)).fill(0).map((_, i) => (
                <div {...{
                  key: i,
                  className: classNames(style.month, i === 0 && style.monthActive),
                  onClick: () => this.changeValue(moment(value).month() + i, 'month'),
                }}>
                  {moment(value).add({ month: i }).format('MMMM')}
                </div>
              ))}
              <TIcon {...{
                type: ICONS_TYPES.arrowWithTail,
                rotate: 180,
                size: 40,
                className: style.calendarArrow,
                onClick: () => this.changeValue(moment(value).month() + 3, 'month'),
              }} />
            </div>
            <div className={style.calendar}>
              <div className={classNames(style.calendarRow, style.calendarHeader)}>
                {calendarFirstWeek.map((item, i) => (
                  <div className={style.calendarCell} key={i}>
                    {moment(item).format('dd')}
                  </div>
                ))}
              </div>
              {calendarArray.map((week, i) => (
                <div className={style.calendarRow} key={i}>
                  {week.map((item, j) => {
                    const cellDisabled = isCellDisabled(item)
                    return (
                      <div {...{
                        key: j,
                        'data-cy': `dateTimePicker${
                          cellDisabled ? 'Inactive' : 'Active'
                        }Day_${
                          moment(item).isSame(value, 'month') ? moment(item).date() : moment(item).format('MM_D')
                        }`,
                        className: classNames(
                          style.calendarCell,
                          style.calendarBodyCell,
                          cellDisabled && style.disabledCell,
                          !moment(item).isSame(value, 'month') && style.otherMonthCell,
                          moment(item).isSame(value, 'day') && style.activeCell,
                        ),
                        onClick: cellDisabled ? () => {} : () => this.changeValue(item, 'date'),
                      }}>
                        {moment(item).date()}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className={style.bodyFooter}>
              {type === PICKER_TYPES.dateTime && timePicker}
              <TButton {...{
                type: BUTTON_TYPES.border,
                color: BUTTON_COLORS.gray,
                className: style.button,
                label: 'Очистить дату',
                onClick: () => {
                  this.setState({ value: undefined }, () => {
                    this.toggleOpen(false)
                  })
                },
              }} />
              <TButton {...{
                className: style.button,
                label: 'Сохранить',
                onClick: () => this.toggleOpen(false),
              }} />
            </div>
          </div>
          }
        </div>
      </TClickOutside>
    )
  }
}

export * from './constants'

export default DateTimePicker
