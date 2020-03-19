import React, { PureComponent } from 'react'
import { IntlProvider } from 'react-intl'

import { DEFAULT_LOCALE } from '$trood/localeService/constants'
import IntlInjector from '$trood/localeService/components/IntlInjector'


class LocalizeServiceProvider extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      messages: {},
      locale: DEFAULT_LOCALE,
      localeDataLoaded: false,
      localeMessagesLoaded: false,
    }
  }

  componentDidMount() {
    document.getElementById('doc-content')
      .setAttribute('style','margin: 0; padding: 0;')
  }

  render() {
    const { children } = this.props
    return (
      <IntlProvider {...{
        ...this.state,
      }}>
        <React.Fragment>
          <IntlInjector />
          {children}
        </React.Fragment>
      </IntlProvider>
    )
  }
}

export default LocalizeServiceProvider
