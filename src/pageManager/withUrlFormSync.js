import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import deepEqual from 'deep-equal'

import { getDisplayName } from '$trood/helpers/react'


export default (fieldsToSyncArg = {}) => (WrappedComponent) => {
  const fieldsToSync = Object.keys(fieldsToSyncArg)
  class WithUrlFormSync extends PureComponent {
    static displayName = `withFormUrlSync(${getDisplayName(WrappedComponent)})`

    constructor(props) {
      super(props)

      this.syncForm = this.syncForm.bind(this)
    }

    componentDidMount() {
      this.syncForm()
    }

    componentDidUpdate(prevProps) {
      const hasChanges = fieldsToSync
        .some(field => !deepEqual(prevProps.location.query[field], this.props.location.query[field]))
      if (hasChanges) this.syncForm()
    }

    syncForm() {
      const {
        location,
        form,
        formActions,
      } = this.props

      const formChanges = fieldsToSync.reduce((memo, field) => {
        const fieldTransform = typeof fieldsToSyncArg[field] === 'function' ? fieldsToSyncArg[field] : v => v
        const value = fieldTransform(location.query[field])
        if (!deepEqual(form[field], value)) {
          return {
            ...memo,
            [field]: value,
          }
        }
        return memo
      }, {})

      if (Object.keys(formChanges).length) {
        formActions.changeSomeFields(formChanges, true)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
  return withRouter(WithUrlFormSync)
}
