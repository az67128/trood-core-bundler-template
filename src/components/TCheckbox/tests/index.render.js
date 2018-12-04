import React, { Component } from 'react'

import TCheckbox from '../'
import { LABEL_POSITION_TYPES } from '../../internal/EnchancedSwitch/constants'
import TIcon from '$trood/components/TIcon'
import { ICONS_TYPES } from '$trood/components/TIcon/constants'


class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: [false, true, true, false, false, false, false],
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
        <TCheckbox {...{
          value: this.state.value[0],
          disabled: false,
          onChange: (changedValue) => { this.changeHandler(0, changedValue) },
          label: <TIcon type={ICONS_TYPES.rub} />,
        }} />
        <TCheckbox {...{
          value: this.state.value[1],
          disabled: false,
          labelPosition: LABEL_POSITION_TYPES.right,
          onChange: (changedValue) => { this.changeHandler(1, changedValue) },
          label: 'Checkbox checked',
        }} />
        <TCheckbox {...{
          value: this.state.value[2],
          disabled: true,
          labelPosition: LABEL_POSITION_TYPES.right,
          onChange: (changedValue) => { this.changeHandler(2, changedValue) },
          label: 'Checkbox checked disabled',
        }} />
        <TCheckbox {...{
          value: this.state.value[5],
          disabled: false,
          labelPosition: LABEL_POSITION_TYPES.left,
          onChange: (changedValue) => { this.changeHandler(5, changedValue) },
          label: 'Normal checkbox with left position',
        }} />
        <TCheckbox {...{
          value: this.state.value[6],
          disabled: false,
          labelPosition: LABEL_POSITION_TYPES.right,
          onChange: (changedValue) => { this.changeHandler(6, changedValue) },
          label: '',
        }} />
      </div>
    )
  }
}

export default Test
