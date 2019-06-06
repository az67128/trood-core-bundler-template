import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import style from './index.css'
import modalsStyle from '$trood/styles/modals.css'

import TSelect from '$trood/components/TSelect'
import TButton from '$trood/components/TButton'
import { BUTTON_COLORS } from '$trood/components/TButton/constants'


class InputModal extends PureComponent {
  static propTypes = {
    onAny: PropTypes.func,
    onAccept: PropTypes.func,
    onDecline: PropTypes.func,

    text: PropTypes.node,
    acceptButtonText: PropTypes.node,
    declineButtonText: PropTypes.node,
    title: PropTypes.node,

    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      label: PropTypes.node,
      selectedLabel: PropTypes.node, // Used for rendering item in selected section
    })),
  }

  static defaultProps = {
    onAny: () => {},
    onAccept: () => {},
    onDecline: () => {},

    options: [],

    text: 'Select value',
    acceptButtonText: 'OK',
    declineButtonText: 'Cancel',
  }

  constructor(props) {
    super(props)

    this.state = {
      selected: undefined,
    }
  }

  render() {
    const {
      onAny,
      onAccept,
      onDecline,

      options,

      acceptButtonText,
      declineButtonText,
      title,
    } = this.props

    const {
      selected,
    } = this.state
    const handleAny = (action) => {
      onAny()
      action(selected)
    }
    return (
      <div className={style.root}>
        {title &&
          <div className={style.title}>
            {title}
          </div>
        }
        <div className={style.text}>
          <TSelect {...{
            items: options,
            className: modalsStyle.control,
            placeHolder: 'Not chosen',
            values: selected && [selected],
            onChange: values => this.setState({ selected: values[0] }),
          }} />
        </div>
        <div className={modalsStyle.buttonsContainer}>
          <TButton {...{
            className: modalsStyle.button,
            label: declineButtonText,
            color: BUTTON_COLORS.gray,
            onClick: () => handleAny(onDecline),
          }} />
          <TButton {...{
            className: modalsStyle.button,
            label: acceptButtonText,
            color: BUTTON_COLORS.blue,
            disabled: !selected,
            onClick: () => handleAny(onAccept),
          }} />
        </div>
      </div>
    )
  }
}

export default InputModal
