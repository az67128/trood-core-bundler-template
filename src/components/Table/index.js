import React from 'react'
import classNames from 'classnames'
import { useObserver } from 'mobx-react-lite'
import BaseComponent from 'core/BaseComponent'
import { Component } from 'core/pageStore'
import Context from 'components/Context'

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
  columnComponents,
}) => {
  const headerComponents = getComponents(columnComponents, 'headerCell', 'th')
  const bodyComponents = getComponents(columnComponents)
  const headerComponentsStore = Component.create({ components: headerComponents })
  const bodyComponentsStore = Component.create({ components: bodyComponents })

  return useObserver(() => (
    <table className={classNames(styles.table, className)}>
      <thead>
        <tr>
          <BaseComponent component={headerComponentsStore} />
        </tr>
      </thead>
      <tbody>
        {entity.getPage(0, 10).map((item, i) => (
          <Context key={i} context={item}>
            <tr>
              <BaseComponent component={bodyComponentsStore} />
            </tr>
          </Context>
        ))}
      </tbody>
    </table>
  ))
}

export default Table
