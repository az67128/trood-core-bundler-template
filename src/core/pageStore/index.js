import { types, flow } from 'mobx-state-tree'
import { nanoid } from 'nanoid'
const normalizeApiPath = (path) => {
  const host = process.env.REACT_APP_COMPONENTS_API_HOST || '/'
  return `${host}${host.endsWith('/') ? '' : '/'}${path.startsWith('/') ? path.slice(1) : path}`
}

export const Component = types
  .model('Component', {
    id: types.optional(types.string, () => nanoid()),
    name: types.optional(types.string, ''),
    components: types.array(types.late(() => Component)),
    props: types.optional(types.frozen({}), {}),
    chunk: types.maybeNull(types.string),
    isLoading: types.optional(types.boolean, false),
  })
  .actions((model) => ({
    setComponents(data) {
      model.components = data.components
    },

    loadChunk: flow(function* ajax() {
      if (!model.chunk) return
      try {
        model.isLoading = true
        const { components } = yield fetch(normalizeApiPath(model.chunk)).then((res) => res.json())
        model.components = components
      } catch (err) {
        console.error(err)
      }
      model.isLoading = false
    }),
  }))

const Modal = types
  .model('Modal', {
    isOpen: types.optional(types.boolean, false),
  })
  .volatile(() => ({
    context: null,
  }))
  .actions((model) => ({
    setContext(context) {
      model.context = context
    },
  }))

export const Page = types
  .model('Page', {
    modals: types.map(Modal),
  })
  .views((model) => ({
    isModalOpen(name) {
      return model.modals.get(name)?.isOpen
    },
    getContext(name) {
      return model.modals.get(name)?.context
    },
  }))
  .actions((model) => ({
    openModal(name, context) {
      model.modals.set(name, { isOpen: true  })
      
      if(context) context.then(result => model.modals.get(name).setContext(result))
      
    },
    closeModal(name) {
      model.modals.set(name, { isOpen: false })
    },
  }))
