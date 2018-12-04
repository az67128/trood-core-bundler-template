import React, { Component } from 'react'

import { SELECT_TYPES, RADIO_GROUP_TYPES } from '../constants'
import { RADIO_TYPES } from '$trood/components/TRadioButton/constants'
import TSelect from '../'


const selectItems = count => (new Array(count).fill(0)).map((a, b) => ({
  value: b,
  label: `item ${b}`,
}))

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = { value: selectItems(30) }
  }

  render() {
    return (
      <div>
        <TSelect {...{
          multi: true,
          items: this.state.value,
          showClearButton: true,
          label: 'label',
          maxRows: 8,
          placeHolder: 'All',
        }}>
          <button onClick={() => console.log('button click')}>Test Button</button>
        </TSelect>
        <TSelect {...{
          items: this.state.value,
          label: 'label',
          maxRows: 8,
          placeHolder: 'All',
        }}>
          <button onClick={() => console.log('button click')}>Test Button</button>
        </TSelect>
        <TSelect {...{
          items: this.state.value,
          label: 'label',
          type: SELECT_TYPES.radio,
          radioGroupType: RADIO_GROUP_TYPES.vertical,
        }} />
        <TSelect {...{
          radioType: RADIO_TYPES.orange,
          items: this.state.value,
          label: 'label',
          type: SELECT_TYPES.radio,
          radioGroupType: RADIO_GROUP_TYPES.horizontal,
        }} />
      </div>
    )
  }
}

export default Test
