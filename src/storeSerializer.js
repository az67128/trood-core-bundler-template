import { writeStorage } from './storage'


let hidden
let visibilityChange

if (typeof document.hidden !== 'undefined') {
  hidden = 'hidden'
  visibilityChange = 'visibilitychange'
} else if (typeof document.mozHidden !== 'undefined') {
  hidden = 'mozHidden'
  visibilityChange = 'mozvisibilitychange'
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden'
  visibilityChange = 'msvisibilitychange'
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden'
  visibilityChange = 'webkitvisibilitychange'
}


const addStorageWriter = (store) => {
  const handleVisibilityChange = () => {
    if (document[hidden]) {
      writeStorage(store)
    }
  }

  document.addEventListener(visibilityChange, handleVisibilityChange, false)
  // Workaround for clearing localstorage from devtools
  if (process.env.PROD) {
    window.onunload = () => {
      writeStorage(store)
    }
  }
}

export default addStorageWriter
