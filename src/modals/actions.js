import {
  ACTIONS_TYPES,
  CONFIRM_MODAL_NAME,
  INPUT_MODAL_NAME,
  MODAL_SIZES,
} from './constants'


export const showModal = (open, name, params) => ({
  type: ACTIONS_TYPES.modals.showModal,
  open,
  name,
  params,
})

export const showConfirmModal = ({
  onAccept = () => {},
  onDecline = () => {},
  ...other
} = {}) => (dispatch) => {
  dispatch(showModal(true, CONFIRM_MODAL_NAME, {
    onAny: () => dispatch(showModal(false, CONFIRM_MODAL_NAME)),
    onAccept,
    onDecline,
    size: MODAL_SIZES.small,
    ...other,
  }))
}

export const showInputModal = ({
  onAccept = () => {},
  onDecline = () => {},
  ...other
} = {}) => (dispatch) => {
  dispatch(showModal(true, INPUT_MODAL_NAME, {
    onAny: () => dispatch(showModal(false, INPUT_MODAL_NAME)),
    onAccept,
    onDecline,
    size: MODAL_SIZES.small,
    ...other,
  }))
}

export const showMessageBoxModal = ({
  onAccept = () => {},
  ...other
} = {}) => (dispatch) => {
  dispatch(showModal(true, CONFIRM_MODAL_NAME, {
    onAny: () => dispatch(showModal(false, CONFIRM_MODAL_NAME)),
    onAccept,
    showDecline: false,
    size: MODAL_SIZES.small,
    ...other,
  }))
}
