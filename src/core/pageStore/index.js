import {types} from 'mobx-state-tree';
import {nanoid} from 'nanoid';

export const Component = types.model('Component', {
    id: types.optional(types.string, ()=>nanoid()),
    name: types.optional(types.string, ''),
    components: types.array(types.late(() => Component)),
    props: types.optional(types.frozen({}), {})
})

export const Page = types.model('Page', {
    modals:types.map(types.model('Modal', {isOpen: types.optional(types.boolean, false)}))
})
.actions(model=>({
    openModal(name){
        model.modals.set(name, {isOpen: true})
    },
    closeModal(name){
        model.modals.set(name, {isOpen: false})
    }
}))
.views(model=>({
    isModalOpen(name){
        return model.modals.get(name)?.isOpen
    }
}))
