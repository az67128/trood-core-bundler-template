import React from 'react'

import style from './index.css'

import QueryRedirect from '$trood/components/QueryRedirect'
import { getQueryLinkPropsFunction } from '$trood/components/QueryLink'

import { Menu, ChainsList, MailsList } from './components'

import { FOLDER_OUTBOX, FOLDER_INBOX } from '../../constants'


const PageMail = ({
  folders,

  chainId,
  chainsApiConfig,
  chainsEntities = {},
  chainsApiActions = {},

  mailsEntities = {},
  mailsApiActions = {},

  mailServiceConfigForm,
  mailServiceActions = {},
  mailServiceConfigFormActions = {},

  modelsForCreateFormFromService = [],
  actionsForCreateFormFromService = {},
  createFormFromEntitiesActions = {},

  filesActions = {},

  match,
  location,
}) => {
  if (!location.query.folder) {
    return (
      <QueryRedirect {...{
        to: {
          pathname: match.url,
          query: {
            ...location.query,
            folder: FOLDER_INBOX,
          },
        },
      }} />
    )
  }

  const getQueryLinkProps = getQueryLinkPropsFunction(location, match)

  return (
    <div className={style.root}>
      <Menu {...{
        className: style.menu,
        folders,
        inbox: FOLDER_INBOX,
        outbox: FOLDER_OUTBOX,
        mailServiceActions,
        getQueryLinkProps,
      }} />
      <ChainsList {...{
        className: style.chainList,
        chainsApiConfig,
        chainsEntities,
        chainsApiActions,

        mailServiceConfigForm,
        mailServiceConfigFormActions,

        getQueryLinkProps,
      }} />
      {chainId &&
        <MailsList {...{
          className: style.mailsList,

          chainId,
          chainsEntities,

          mailsEntities,
          mailsApiActions,
          mailServiceActions,

          filesActions,

          modelsForCreateFormFromService,
          actionsForCreateFormFromService,
          createFormFromEntitiesActions,
        }} />
      }
    </div>
  )
}

export default PageMail
