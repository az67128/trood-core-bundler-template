import React, { Component } from 'react'

import TRadioButton from '../'
import { LABEL_POSITION_TYPES } from '../../internal/EnchancedSwitch/constants'
import TIcon from '$trood/components/TIcon'
import { ICONS_TYPES } from '$trood/components/TIcon/constants'
import { RADIO_TYPES } from '../constants'


class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: [false, true, true, false, false, false, false, false],
    }
  }

  changeHandler(i, checked) {
    const check = this.state.value.slice()
    check[i] = checked
    this.setState({
      value: check,
    })
  }

  render() {
    return (
      <div>
        <TRadioButton {...{
          value: this.state.value[0],
          onChange: (changedValue) => { this.changeHandler(0, changedValue) },
          label: <TIcon type={ICONS_TYPES.rub} />,
        }} />
        <TRadioButton {...{
          value: this.state.value[1],
          onChange: (changedValue) => { this.changeHandler(1, changedValue) },
          label: 'Radio checked',
        }} />
        <TRadioButton {...{
          value: this.state.value[2],
          disabled: true,
          onChange: (changedValue) => { this.changeHandler(2, changedValue) },
          label: 'Radio checked disabled',
        }} />
        <TRadioButton {...{
          value: this.state.value[5],
          labelPosition: LABEL_POSITION_TYPES.left,
          onChange: (changedValue) => { this.changeHandler(5, changedValue) },
          label: 'Normal checkbox with left position',
        }} />
        <TRadioButton {...{
          value: this.state.value[6],
          onChange: (changedValue) => { this.changeHandler(6, changedValue) },
          label: '',
        }} />
        <TRadioButton {...{
          value: this.state.value[7],
          onChange: (changedValue) => { this.changeHandler(7, changedValue) },
          label: 'Radio orange',
          type: RADIO_TYPES.orange,
        }} />
      </div>
    )
  }
}

export default Test
