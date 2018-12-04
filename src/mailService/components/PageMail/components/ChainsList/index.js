import React from 'react'
import classNames from 'classnames'

import style from './index.css'

import AsyncEntitiesList from '$trood/components/AsyncEntitiesList'
import QueryLink from '$trood/components/QueryLink'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import SmartDate, { SMART_DATE_FORMATS } from '$trood/components/SmartDate'


const ChainsList = ({
  className,

  chainsApiConfig,
  chainsEntities = {},
  chainsApiActions = {},

  mailServiceConfigForm,
  mailServiceConfigFormActions = {},

  getQueryLinkProps = () => {},
}) => {
  const chains = chainsEntities.getArray(chainsApiConfig)
  const chainsIsLoading = chainsEntities.getIsLoadingArray(chainsApiConfig)
  const chainsNextPage = chainsEntities.getNextPage(chainsApiConfig)
  return (
    <div className={classNames(style.root, className)} >
      <div className={style.searchContainer}>
        <TInput {...{
          className: style.searchInput,
          defaultValue: mailServiceConfigForm.chainSearch,
          replaceValue: mailServiceConfigForm.chainSearch,
          type: INPUT_TYPES.search,
          onChange: value => mailServiceConfigFormActions.changeField('chainSearch', value),
          onSearch: value => mailServiceConfigFormActions.changeField('chainActualSearch', value),
          placeholder: 'Поиск',
        }} />
      </div>
      <AsyncEntitiesList {...{
        className: style.chainsList,
        nextPage: chainsNextPage,
        isLoading: chainsIsLoading,
        nextPageAction: () => chainsApiActions.loadNextPage(chainsApiConfig),
      }} >
        {chains.map(chain => {
          return (
            <QueryLink {...{
              key: chain.chain,
              className: classNames(style.chain, chain.unread && style.unreadChain),
              activeClassName: style.active,
              ...getQueryLinkProps({ chain: chain.chain }),
            }}>
              <div className={style.chainHeader}>
                <div className={style.chainCounter}>
                  {!!chain.unread &&
                    <span>{chain.unread}/</span>
                  }
                  <span>{chain.total}</span>
                </div>
                <div className={style.chainSubject}>
                  {chain.chainSubject}
                </div>
                <SmartDate {...{
                  className: style.chainDate,
                  date: chain.last,
                  format: SMART_DATE_FORMATS.relativeShortWithTime,
                }} />
              </div>
              <div className={style.chainContacts}>
                {chain.contacts.join(', ')}
              </div>
            </QueryLink>
          )
        })}
      </AsyncEntitiesList>
    </div>
  )
}

export default ChainsList
