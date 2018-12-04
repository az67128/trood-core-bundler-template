import { ACTIONS_TYPES } from './constants'

import { ROUTER_LOCATION_CHANGE_ACTION } from '$trood/mainConstants'


export const init = {
  $modalsCounter: 0,
}

const modals = (state = init, action) => {
  switch (action.type) {
    case ACTIONS_TYPES.modals.showModal: {
      if (!action.open && !action.name) return init
      const $modalsCounter = action.open ? state.$modalsCounter + 1 : state.$modalsCounter
      return {
        ...state,
        $modalsCounter,
        [action.name]: action.open ? {
          open: action.open,
          params: action.params,
          order: state.$modalsCounter,
        } : action.open,
      }
    }
    case ROUTER_LOCATION_CHANGE_ACTION:
      return init
    default:
      return state
  }
}

export default modals
