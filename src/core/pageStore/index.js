import { types, flow } from 'mobx-state-tree'
import { nanoid } from 'nanoid'
const normalizeApiPath = (path) => {
  const host = process.env.REACT_APP_COMPONENTS_API_HOST || '/'
  return `${host}${host.endsWith('/') ? '' : '/'}${path.startsWith('/') ? path.slice(1) : path}`
}

const convertObject = (cur, data) => {
  const component = {
    name: typeof cur.type === 'string' ? cur.type : cur.type.resolvedName,
    props:cur.props,
  }
  if(component.name ==='List'){
    const linkedNodes = data[cur.linkedNodes.list]
    linkedNodes.nodes.forEach(id => {
      const el = data[id]
      component.props[el.props.id] = [convertObject(el, data)]
    })
  }
  if(cur.nodes.length >0) {
    component.components = cur.nodes.map(nodeId => convertObject(data[nodeId], data))
  }
  console.log(component)
  return component
}
export const Component = types
  .model('Component', {
    id: types.optional(types.string, () => nanoid()),
    name: types.optional(types.string, ''),
    components: types.array(types.maybeNull(types.late(() => Component))),
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
        const { data } = yield fetch(normalizeApiPath(model.chunk)).then((res) => res.json())
        const query =  JSON.parse(data.query)
        
        const converted = convertObject(query.ROOT, query)
        
        
        model.components = converted.components
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

const Context = types
  .model('Context', {
    isOpen: types.optional(types.boolean, false),
    context: types.optional(types.frozen({}), {}),
  })
  .actions(model => ({
    setContext(context){
      model.context = context
    },
    modifyProp(prop, value){
      model.context = { ...model.context, [prop]:value }
    },
  }))
  

export const Page = types
  .model('Page', {
    modals: types.map(Modal),
    contexts: types.map(Context),
  })
  .views((model) => ({
    isModalOpen(name) {
      return model.modals.get(name)?.isOpen
    },
    getContext(name) {
      return model.contexts.get(name)?.context
    },
  }))
  .actions((model) => ({
    setContext(name, context) {
      model.contexts.set(name, {  })
      model.contexts.get(name).setContext(context)
    },
    openModal(name, context) {
      model.modals.set(name, { isOpen: true  })
      model.setContext(name, context)
    },
    closeModal(name) {
      model.modals.set(name, { isOpen: false })
    },
    modifyContext(name, prop, value){
      model.contexts.get(name).modifyProp(prop, value)
    },
  }))
