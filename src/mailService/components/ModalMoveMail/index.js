import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'


class ModalMoveMail extends PureComponent {
  static propTypes = {
    className: PropTypes.string,

    mailServiceConfigForm: PropTypes.object,

    folders: PropTypes.arrayOf(PropTypes.object),

    submitAction: PropTypes.func,

    chainsActions: PropTypes.object,

    mailServiceActions: PropTypes.object,
  }

  static defaultProps = {
    className: '',

    mailServiceActions: {},
  }

  render() {
    const {
      className,

      mailServiceConfigForm,

      folders,

      submitAction,

      chainsActions,

      mailServiceActions,
    } = this.props

    return (
      <div {...{
        className: classNames(style.root, className),
      }} >
        {folders.map(folder => (
          <div {...{
            key: folder.id,
            className: style.folder,
            onClick: () => {
              mailServiceActions.moveChains(mailServiceConfigForm.movingId, folder.id)
                .then(() => submitAction())
                .then(() => chainsActions.clearPages())
            },
          }}>
            {folder.name}
          </div>
        ))}
      </div>
    )
  }
}

export default ModalMoveMail
