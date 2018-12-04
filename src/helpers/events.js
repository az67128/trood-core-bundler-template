const on = (el, type, callback) => el.addEventListener(type, callback, false)

const off = (el, type, callback) => el.removeEventListener(type, callback, false)

export const bind = (events, callback) => events.forEach(event => on(document, event, callback))

export const unbind = (events, callback) => events.forEach(event => off(document, event, callback))
