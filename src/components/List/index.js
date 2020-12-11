import React from 'react'
import BaseComponent from 'core/BaseComponent'
import { Component } from 'core/pageStore'
import Context from 'components/Context'

import Paginator from '../internal/Paginator'

const List = ({
  entity,
  queryOptions,
  components,
  pagination = {},
}) => {
  const componentsStore = Component.create({ components })

  return (
    <Paginator {...pagination} entity={entity} queryOptions={queryOptions}>
      {({ items }) => items.map((item) => (
        <Context key={item.id} context={item}>
          <BaseComponent  $context={item} component={componentsStore} />
        </Context>
      ))}
    </Paginator>
  )
}

export default List
