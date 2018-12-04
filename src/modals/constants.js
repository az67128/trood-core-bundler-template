import { makeActionsBundle } from '$trood/helpers/actions'


export const NAME = 'modals'


const actionsTypesModals = [
  'SHOW_MODAL',
]

export const ACTIONS_TYPES = {
  modals: makeActionsBundle(NAME, 'modals', actionsTypesModals),
}

export const CONFIRM_MODAL_NAME = 'confirmModal'
export const INPUT_MODAL_NAME = 'inputModal'

export const MODAL_FULL = 'full'
export const MODAL_LARGE = 'large'
export const MODAL_MEDIUM = 'medium'
export const MODAL_SMALL = 'small'

export const MODAL_SIZES = {
  [MODAL_LARGE]: MODAL_LARGE,
  [MODAL_MEDIUM]: MODAL_MEDIUM,
  [MODAL_SMALL]: MODAL_SMALL,
  [MODAL_FULL]: MODAL_FULL,
}

export const registeredModals = []

export const addRegisteredModal = (modal) => {
  registeredModals.push(modal)
}
