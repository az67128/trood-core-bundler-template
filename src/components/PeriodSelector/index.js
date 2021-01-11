import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.module.css'

import useTooltip from '../internal/Tooltip'

import Label from '../Label'
import Select from '../Select'
import Button, { BUTTON_TYPES, BUTTON_COLORS } from '../Button'
import DateTimePicker, { PICKER_TYPES } from '../DateTimePicker'

import {
  PERIOD_CUSTOM,
  PERIOD_TYPES,
  DEFAULT_PERIODS,
  getPeriodSelector,
} from './constants'


class PeriodSelector extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    periods: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(PERIOD_TYPES))),
    defaultPeriodType: PropTypes.oneOf(DEFAULT_PERIODS),

    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    periods: DEFAULT_PERIODS,
    onSubmit: () => {},
  }

  constructor(props) {
    super(props)

    this.state = {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
    }
  }

  componentDidMount() {
    const {
      periodType,
      defaultPeriodType,
      periods,
      onSubmit,
    } = this.props

    if (!periodType && defaultPeriodType && defaultPeriodType !== periods[0]) {
      onSubmit({
        periodType: defaultPeriodType,
        ...getPeriodSelector(defaultPeriodType),
      })
      this.setState(getPeriodSelector(defaultPeriodType))
    }
  }

  render() {
    const {
      className,
      periods,
      label,
      periodType,
      resetField,
      resetFieldsArray,
      dataAttributes,

      onSubmit,
    } = this.props

    const {
      startDate,
      endDate,
    } = this.state

    return (
      <div className={classNames(style.root, className)}>
        <Label label={label} />
        <div className={style.components}>
          <Select {...{
            dataAttributes,
            className: style.filterInput,
            maxRows: 8,
            values: [periodType || periods[0]],
            items: periods.map(key => ({
              value: key,
              label: PERIOD_TYPES[key],
            })),
            onChange: values => {
              if (resetFieldsArray) {
                (resetFieldsArray || []).map(m => resetField(m))
              }
              const period = values[0]
              onSubmit({
                periodType: period,
                ...getPeriodSelector(period),
              })
              this.setState(getPeriodSelector(period))
            },
          }} />
          {periodType === PERIOD_CUSTOM &&
          <React.Fragment>
            <DateTimePicker {...{
              className: style.filterInput,
              type: PICKER_TYPES.date,
              placeholder: 'Start date', // TODO i18n
              value: startDate,
              onChange: value => {
                if (resetFieldsArray) {
                  (resetFieldsArray || []).map(m => resetField(m))
                }
                this.setState({ startDate: value })
              },
              validate: {
                dateRequired: true,
              },
            }} />
            <DateTimePicker {...{
              className: style.filterInput,
              type: PICKER_TYPES.date,
              placeholder: 'End date', // TODO i18n
              value: endDate,
              onChange: value => {
                if (resetFieldsArray) {
                  (resetFieldsArray || []).map(m => resetField(m))
                }
                this.setState({ endDate: value })
              },
              validate: {
                minDate: startDate,
                dateRequired: true,
                checkOnBlur: true,
              },
            }} />
            <Button {...{
              className: style.addContactButton,
              onClick: () => onSubmit({ startDate, endDate }),
              label: 'Ok', // TODO i18n
              type: BUTTON_TYPES.border,
              color: BUTTON_COLORS.gray,
            }} />
          </React.Fragment>
          }
        </div>
      </div>
    )
  }
}

export * from './constants'

export default useTooltip(PeriodSelector)
