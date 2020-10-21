import React from 'react'
import { useObserver } from 'mobx-react-lite'
import BaseComponent from 'core/BaseComponent'
import { Component } from 'core/pageStore'


const defaultControlComponents = [
  {
    name: 'Button',
    props: {
      specialType: 'arrowLeft',
      type: 'text',
      onClick: {
        $type: '$data',
        path: '$context.prevPage',
      },
    },
  },
  {
    name: 'Button',
    props: {
      specialType: 'arrowRight',
      type: 'text',
      onClick: {
        $type: '$data',
        path: '$context.nextPage',
      },
    },
  },
]

const List = ({
  entity,
  components,
  bottomComponents = defaultControlComponents,
  topComponents = defaultControlComponents,
}) => {
  const [page, setPage] = React.useState(0)
  const componentsStore = Component.create({ components })
  const bottomComponentsStore = Component.create({ components: bottomComponents })
  const topComponentsStore = Component.create({ components: topComponents })

  const nextPage = () => setPage(page + 1)
  const prevPage = () => setPage(page === 0 ? 0 : page - 1)
  return useObserver(() => (
    <div>
      {topComponents && (
        <BaseComponent $context={{ nextPage, prevPage }} component={topComponentsStore} />
      )}
      {entity.getPage(page, 5).map((item) => (
        <BaseComponent key={item.name} $context={item} component={componentsStore} />
      ))}
      {bottomComponents && (
        <BaseComponent $context={{ nextPage, prevPage }} component={bottomComponentsStore} />
      )}
    </div>
  ))
}

export default List
