import React from 'react'
import classNames from 'classnames'

import modalsStyle from '$trood/styles/modals.css'
import style from './index.css'

import TButton from '$trood/components/TButton'
import { BUTTON_COLORS } from '$trood/components/TButton/constants'


const ConfirmModal = ({
  onAny = () => {},
  onAccept = () => {},
  onDecline = () => {},

  showAccept = true,
  showDecline = true,

  ...other
}) => {
  const text = other.text || 'Are you sure?'

  const acceptButtonText = other.acceptButtonText || 'Yes'

  const declineButtonText = other.declineButtonText || 'No'

  const handleAny = (action) => {
    onAny()
    action()
  }
  return (
    <div className={style.root}>
      {other.title &&
        <div className={classNames(style.title, style.firstRowPadding)}>
          {other.title}
        </div>
      }
      <div className={classNames(style.text, !other.title && style.firstRowPadding)}>
        {text}
      </div>
      <div className={modalsStyle.buttonsContainer}>
        {showDecline &&
          <TButton {...{
            className: modalsStyle.button,
            label: declineButtonText,
            color: BUTTON_COLORS.gray,
            onClick: () => handleAny(onDecline),
          }} />
        }
        {showAccept &&
          <TButton {...{
            className: modalsStyle.button,
            label: acceptButtonText,
            color: BUTTON_COLORS.blue,
            onClick: () => handleAny(onAccept),
          }} />
        }
      </div>
    </div>
  )
}

export default ConfirmModal
