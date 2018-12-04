import React from 'react'
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
  const text = other.text || 'Вы уверены?'

  const acceptButtonText = other.acceptButtonText || 'Ок'

  const declineButtonText = other.declineButtonText || 'Отмена'

  const handleAny = (action) => {
    onAny()
    action()
  }
  return (
    <div className={style.root}>
      {other.title &&
        <div className={style.title}>
          {other.title}
        </div>
      }
      <div className={style.text}>
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
