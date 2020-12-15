import React from 'react'
import PropTypes from 'prop-types'
import BaseComponent from 'core/BaseComponent'
import { Component } from 'core/pageStore'
import Context from 'components/Context'

import Paginator from '../internal/Paginator'

const List = ({
  className,
  entity,
  queryOptions,
  components,
  pagination = {},
}) => {
  const componentsStore = Component.create({ components })

  return (
    <Paginator {...pagination} className={className} entity={entity} queryOptions={queryOptions}>
      {({ items }) => items.map((item) => (
        <Context key={item.id} context={item}>
          <BaseComponent  $context={item} component={componentsStore} />
        </Context>
      ))}
    </Paginator>
  )
}

List.propTypes = {
  className: PropTypes.string,
  entity: PropTypes.shape({
    getPage: PropTypes.func,
    getPageLoading: PropTypes.func,
    getPagesCount: PropTypes.func,
    getInfinityPages: PropTypes.func,
    getInfinityPagesLoading: PropTypes.func,
    getInfinityNextPage: PropTypes.func,
    getInfinityNextPageNumber: PropTypes.func,
  }).isRequired,
  queryOptions: PropTypes.shape({
    headers: PropTypes.object,
    hash: PropTypes.string,
    cacheMaxAgeMs: PropTypes.number,
    filters: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  components: PropTypes.arrayOf(PropTypes.object),
  pagination: PropTypes.shape({
    type: PropTypes.oneOf(['classic', 'infinity', 'disabled']),
    defaultPageSize: PropTypes.number,
    pagesControlsCount: PropTypes.number,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    scrollContainerSelector: PropTypes.string,
    topControls: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.object)]),
    bottomControls: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.object)]),
    infinityControls: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.object)]),
  }),
}

export default List
