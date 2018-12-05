import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import TButton, { BUTTON_TYPES, BUTTON_COLORS } from '$trood/components/TButton'
import QueryLink from '$trood/components/QueryLink'
import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'


class Menu extends PureComponent {
  render() {
    const {
      className,

      folders = [],
      inbox,
      outbox,

      mailServiceActions = {},
      getQueryLinkProps = () => {},
    } = this.props

    return (
      <div className={classNames(style.root, className)}>
        <div className={style.sendBlock}>
          <TButton {...{
            label: (
              <TIcon {...{
                type: ICONS_TYPES.mail,
                size: 15,
                label: 'Написать письмо',
              }} />
            ),
            onClick: () => mailServiceActions.writeMail(),
          }} />
        </div>
        <div className={style.foldersList}>
          {inbox &&
          <QueryLink {...{
            className: style.specialFolderButton,
            activeClassName: style.active,
            ...getQueryLinkProps({ folder: inbox, chain: undefined }),
          }}>
            <TIcon {...{
              type: ICONS_TYPES.mail,
              size: 15,
              label: 'Входящие',
            }} />
          </QueryLink>
          }
          {!!folders.length &&
          <div className={style.foldersTitle}>
            Папки
          </div>
          }
          {folders.map(folder => (
            <QueryLink {...{
              key: folder.id,
              className: style.folder,
              activeClassName: style.active,
              ...getQueryLinkProps({ folder: folder.id, chain: undefined }),
            }}>
              {folder.name}
            </QueryLink>
          ))}
          {outbox &&
          <QueryLink {...{
            className: style.specialFolderButton,
            activeClassName: style.active,
            ...getQueryLinkProps({ folder: outbox, chain: undefined }),
          }}>
            <TIcon {...{
              type: ICONS_TYPES.mail,
              size: 15,
              label: 'Отправленные',
            }} />
          </QueryLink>
          }
        </div>
        <TButton {...{
          className: style.buttonSettings,
          type: BUTTON_TYPES.text,
          color: BUTTON_COLORS.white,
          label: (
            <TIcon {...{
              type: ICONS_TYPES.settings,
              size: 15,
              label: 'Настройки',
            }} />
          ),
          onClick: () => mailServiceActions.showMailServiceSettingsModal(),
        }} />
      </div>
    )
  }
}

export default Menu
