import React, { Component } from 'react'

import TToggle from '../'
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
        <TToggle {...{
          value: this.state.value[0],
          onChange: (changedValue) => { this.changeHandler(0, changedValue) },
          label: <TIcon type={ICONS_TYPES.rub} />,
        }} />
        <TToggle {...{
          value: this.state.value[1],
          onChange: (changedValue) => { this.changeHandler(1, changedValue) },
          label: 'Toggle checked',
        }} />
        <TToggle {...{
          value: this.state.value[2],
          disabled: true,
          onChange: (changedValue) => { this.changeHandler(2, changedValue) },
          label: 'Toggle checked disabled',
        }} />
        <TToggle {...{
          value: this.state.value[5],
          labelPosition: LABEL_POSITION_TYPES.left,
          onChange: (changedValue) => { this.changeHandler(5, changedValue) },
          label: 'Normal checkbox with left position',
        }} />
        <TToggle {...{
          value: this.state.value[6],
          onChange: (changedValue) => { this.changeHandler(6, changedValue) },
          label: '',
        }} />
      </div>
    )
  }
}

export default Test
