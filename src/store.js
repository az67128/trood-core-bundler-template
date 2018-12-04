import { readStorage } from './storage'
import configureStore from './configureStore'

const getStore = (history) => {
  return configureStore(history, readStorage())
}

export default getStore
