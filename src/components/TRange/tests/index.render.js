import React, { Component } from 'react'
import TRange from '../'


class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      min: 0, max: 10, step: 0.1, defaultValue: 2,
    }
  }

  render() {
    return (
      <TRange {...{
        ...this.state,
        onChange: () => {},
      }} />
    )
  }
}

export default Test
