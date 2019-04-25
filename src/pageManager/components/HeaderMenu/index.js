import PropTypes from 'prop-types'
import React from 'react'
import { Route } from 'react-router-dom'
import classNames from 'classnames'

import style from './index.css'
import urlSchema, {
  urlSchemaConfig,
  HEADER_SHOW,
  HEADER_HIDE,
} from '../../urlSchema'

import TIcon from '$trood/components/TIcon'

import { getNestedObjectField } from '$trood/helpers/nestedObjects'
import localeService, { intlObject } from '$trood/localeService'

import PageNavLink from '../PageNavLink'
import { HEADER_TYPES, MIN_MENU_RENDERERS } from './constants'


const HeaderMenu = ({
  className = '',
  type = HEADER_TYPES.left,

  basePath = [],
  menuRenderers = {},

  additionalLinks = [],
  LinkComponent,
  linkClassName,
  linkActiveClassName,
}) => {
  if (Object.keys(menuRenderers).length < MIN_MENU_RENDERERS && !additionalLinks.length) return null
  const preAdditionalLinks = additionalLinks.filter(link => link && link.pre)
  const postAdditionalLinks = additionalLinks.filter(link => link && !link.pre)
  const mapAdditionalLinks = (link, key) => {
    return (
      <div {...{
        key,
        onClick: link.onClick && (() => link.onClick()),
        className: classNames(
          linkClassName,
          style.url,
          link.active && style.active,
          link.active && linkActiveClassName,
          link.className,
          link.active && link.activeClassName,
        ),
      }}>
        {
          !LinkComponent &&
          <React.Fragment>
            {link.iconType &&
              <TIcon {...{
                className: style.icon,
                type: link.iconType,
              }} />
            }
            <span>{link.label}</span>
          </React.Fragment>
        }
        {
          LinkComponent &&
          <LinkComponent {...{
            icon: link.iconType,
            label: link.label,
          }} />
        }
      </div>
    )
  }
  return (
    <Route render={() => {
      const currentSchemaConfig = getNestedObjectField(
        urlSchemaConfig,
        [].concat(basePath)
          .map(name => [name, 'pages'])
          .reduce((a, b) => a.concat(b), []),
      )
      const currentBaseUrl = getNestedObjectField(urlSchema, basePath)

      const routeToRenderedKeysReduceFunc = (schemaConfig, prevKey) => (memo, key) => {
        const currentConfig = schemaConfig[key]
        if (currentConfig.header === HEADER_HIDE) return memo
        if (currentConfig.header === HEADER_SHOW) return [...memo, prevKey ? [].concat(prevKey, key) : key]
        return memo
      }
      const headerKeysToRender = Object.keys(currentSchemaConfig).reduce(
        routeToRenderedKeysReduceFunc(currentSchemaConfig),
        [],
      )
      return (
        <div className={classNames(style.root, style[type], className)}>
          {preAdditionalLinks.map(mapAdditionalLinks)}
          {headerKeysToRender.map(key => {
            const currentRenderer = getNestedObjectField(menuRenderers, key) || menuRenderers[key[key.length - 1]]
            if (!currentRenderer) return null
            let currentLabel = currentRenderer.label
            const currentMessage = localeService.localeMessages[currentRenderer.localeMessageId]
            if (currentRenderer.localeMessageId && intlObject.intl && currentMessage) {
              currentLabel = intlObject.intl.formatMessage(currentMessage)
            }
            const currentIconType = currentRenderer.iconType
            return (
              <PageNavLink {...{
                key,
                navKey: key,
                baseUrl: currentBaseUrl,
                activeClassName: classNames(style.active, linkActiveClassName),
                className: classNames(style.url, linkClassName),
              }}>
                {
                  !LinkComponent &&
                  <React.Fragment>
                    {currentIconType &&
                      <TIcon className={style.icon} type={currentIconType} />
                    }
                    {currentLabel}
                  </React.Fragment>
                }
                {
                  LinkComponent &&
                  <LinkComponent {...{
                    icon: currentIconType,
                    label: currentLabel,
                  }} />
                }
              </PageNavLink>
            )
          })}
          {postAdditionalLinks.map(mapAdditionalLinks)}
        </div>
      )
    }} />
  )
}

HeaderMenu.propTypes = {
  type: PropTypes.oneOf(Object.values(HEADER_TYPES)),
}

export { HEADER_TYPES }

export default HeaderMenu
