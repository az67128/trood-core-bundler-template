import React, { PureComponent } from 'react'

import style from './index.css'

import Header from './components/Header'
import PageHeader from './components/PageHeader'

import { RouteSchema } from '$trood/pageManager'


import { DEFAULT_SCROLLING_CONTAINER_ID } from '$trood/mainConstants'


class BasePageComponent extends PureComponent {
  static propTypes = {
  }

  static defaultProps = {
  }

  render() {
    const {
      authActions,
      renderers,
      menuRenderers,
      match,
      registeredRoutesPaths,
      layoutProps,
    } = this.props

    return (
      <React.Fragment>
        <Header {...{
          authActions,
          menuRenderers,
          layoutProps,
        }} />
        <div id={DEFAULT_SCROLLING_CONTAINER_ID} className={style.components}>
          <PageHeader {...{
            layoutProps,
          }} />
          <RouteSchema {...{
            renderers,
            registeredRoutesPaths,
            prevMatch: match,
          }} />
        </div>
      </React.Fragment>
    )
  }
}

export default BasePageComponent
