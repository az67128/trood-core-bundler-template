import React, { Component } from 'react'
import TAvatar from '../'


class Test extends Component {
  constructor(props) {
    super(props)
    this.state = { avatar: 'http://forum.igromania.ru/customavatars/avatar196601_5.gif' }
  }

  render() {
    return (
      <TAvatar {...{
        avatar: this.state.avatar,
        size: 100,
        round: true,
        editable: true,
        change: file => console.log(file),
      }} />
    )
  }
}

export default Test
