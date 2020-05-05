import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import TSelect from '$trood/components/TSelect'
import TButton, { BUTTON_TYPES, BUTTON_COLORS } from '$trood/components/TButton'
import DateTimePicker, { PICKER_TYPES } from '$trood/components/DateTimePicker'

import {
  REPORTING_PERIOD_TYPES,
  REPORTING_PERIOD_TYPES_DICT,
  DEFAULT_PERIODS,
  getPeriodSelector,
} from './constants'

// import globalMessages from '$trood/globalMessages'
import { intlObject } from '$trood/localeService'


class PeriodSelector extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    periods: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(REPORTING_PERIOD_TYPES))),
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

      onSubmit,
    } = this.props

    const {
      startDate,
      endDate,
    } = this.state

    return (
      <div className={classNames(style.root, className)}>
        <TSelect {...{
          className: style.filterInput,
          label,
          maxRows: 8,
          values: [periodType || periods[0]],
          items: periods.map(key => ({
            value: key,
            label: intlObject.intl.formatMessage(REPORTING_PERIOD_TYPES_DICT[key]),
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
        {periodType === REPORTING_PERIOD_TYPES.custom &&
        <React.Fragment>
          <DateTimePicker {...{
            className: style.filterInput,
            type: PICKER_TYPES.date,
            placeholder: 'startDate',//intlObject.intl.formatMessage(globalMessages.startDate),
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
            placeholder: 'endDate', //intlObject.intl.formatMessage(globalMessages.endDate),
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
          <TButton {...{
            className: style.addContactButton,
            onClick: () => onSubmit({ startDate, endDate }),
            label: 'ok', //intlObject.intl.formatMessage(globalMessages.ok),
            type: BUTTON_TYPES.border,
            color: BUTTON_COLORS.gray,
          }} />
        </React.Fragment>
        }
      </div>
    )
  }
}

export * from './constants'

export default PeriodSelector
