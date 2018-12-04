/* eslint-disable max-len */
import React, { Component } from 'react'
import TAvatarEditor from '../'


class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6AQMAAACyIsh+AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURf///wAAAFXC034AAAGcSURBVGjehdAxEQBBCACxl460k4IESgoGXkK2TrXfp0LgCaRACbTACKzAEWjEacRpxGnEacRpxGnEHUEIPIEUKIEWGIEVOIIQeAIpUAItMAIrcAQh8ARSoARaYARW4AhC4AmkQAm0wAiswBGEwBNIgRJogRFYgSMIgSeQAiXQAiOwAkcQAk8gBUqgBUZgBY4gBJ5ACpRAC4zAChxBCDyBFCiBFhiBFTiCEHgCKVACLTACK3AEIfAEUqAEWmAEVuAIQuAJpEAJtMAIrMARhMATSIESaIERWIEjCIEnkAIl0AIjsAJHEAJPIAVKoAVGYAWOIASeQAqUQAuMwAocQQg8gRQogRYYgRU4ghB4AilQAi0wAitwBCHwBFKgBFpgBFbgCELgCaRACbTACKzAEYTAE0iBEmiBEViBIwiBJ5ACJdACI7ACRxACTyAFSqAFRmAFjiAEnkAKlEALjMAKHEEIPIEUKIEWGIEVOIIQeAIpUAItMAIrcAQh8ARSoARaYARW4AhC4AmkQAm0wAiswBGEwBNIgRJogRFYgSOIH393ctpzK/JHAAAAAElFTkSuQmCC',
    }
  }

  render() {
    return (
      <TAvatarEditor image={this.state.image} />
    )
  }
}

export default Test
