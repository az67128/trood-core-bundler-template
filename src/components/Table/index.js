import React from 'react'
import classNames from 'classnames'
import BaseComponent from 'core/BaseComponent'
import { Component } from 'core/pageStore'
import Context from 'components/Context'

import Paginator from '../internal/Paginator'

import styles from './index.module.css'


const getComponents = (columnComponents, componentKey = 'bodyCell', wrapper = 'td') =>
  columnComponents.map(c => {
    let component = c[componentKey]
    if (!component || component.name !== wrapper) {
      component = {
        name: wrapper,
        components: [c[componentKey]],
      }
    }
    return component
  })

const Table = ({
  className,
  entity,
  queryOptions,
  columnComponents,
  pagination = {},
}) => {
  const headerComponents = getComponents(columnComponents, 'headerCell', 'th')
  const bodyComponents = getComponents(columnComponents)
  const headerComponentsStore = Component.create({ components: headerComponents })
  const bodyComponentsStore = Component.create({ components: bodyComponents })

  return (
    <Paginator {...pagination} entity={entity} queryOptions={queryOptions}>
      {({ items }) => (
        <table className={classNames(styles.table, className)}>
          <thead>
            <tr>
              <BaseComponent component={headerComponentsStore} />
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <Context key={i} context={item}>
                <tr>
                  <BaseComponent component={bodyComponentsStore} />
                </tr>
              </Context>
            ))}
          </tbody>
        </table>
      )}
    </Paginator>
  )
}

export default Table
