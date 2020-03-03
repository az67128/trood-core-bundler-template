import React, { PureComponent } from 'react'
import classNames from 'classnames'
import loadable from '@loadable/component'
import debounce from 'lodash/debounce'

import style from './index.css'

import AsyncEntitiesList, { LIST_TYPES } from '$trood/components/AsyncEntitiesList'
import DotMenu from '$trood/components/DotMenu'
import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'
import LoadingIndicator from '$trood/components/LoadingIndicator'

import { messages } from '../../../../constants'
import { intlObject } from '$trood/localeService'

import Mail from '../Mail'


const EntityPageLink = loadable(
  () => import('$trood/pageManager')
    .then(pageManager => pageManager.EntityPageLink),
  {
    fallback: (<LoadingIndicator />),
  },
)

const SET_READ_TIMEOUT = 3000

class MailsList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.scrolled = false
    this.beforeLoadNextPageScrollHeight = 0
    this.beforeLoadNextPageScrollTop = 0

    this.setChainRead = debounce(this.setChainRead.bind(this), SET_READ_TIMEOUT)
    this.scrollToMail = this.scrollToMail.bind(this)
    this.getAttachedEntity = this.getAttachedEntity.bind(this)
  }

  componentDidMount() {
    this.scrollToMail()
    this.getAttachedEntity()
  }

  componentDidUpdate(prevProps) {
    if (this.props.chainId !== prevProps.chainId) {
      this.getAttachedEntity()
      this.setChainRead.cancel()
      this.scrolled = false
    }
    this.scrollToMail()
  }

  componentWillUnmount() {
    this.setChainRead.cancel()
  }

  getAttachedEntity() {
    const {
      chainId,
      modelsForCreateFormFromService = [],
      actionsForCreateFormFromService = {},
    } = this.props
    Promise.all(
      modelsForCreateFormFromService.map(item => {
        const getAttachedEntityAction = actionsForCreateFormFromService[item.getAttachedEntityActionName]

        if (getAttachedEntityAction) {
          return getAttachedEntityAction(chainId)
            .then(v => ({ [item.modelName]: v }))
        }
        return { [item.modelName]: undefined }
      }),
    )
      .then(res => res.reduce((memo, curr) => ({
        ...memo,
        ...curr,
      }), {}))
      .then(res => {
        const newState = Object.keys(res).reduce((memo, curr) => ({
          ...memo,
          [curr]: res[curr],
          attaches: memo.attaches + !!res[curr],
        }), { attaches: 0 })
        // Cause of async actions, component can be unmounted at the time setState is called
        if (!this.willUnmount) {
          this.setState(newState)
        }
      })
  }

  setChainRead(mails = []) {
    const {
      chainId,
      mailServiceActions = {},
    } = this.props

    mailServiceActions.setChainRead(chainId, mails)
  }

  scrollToMail() {
    if (this.scrolled) {
      if (this.beforeLoadNextPageScrollHeight) {
        this.mailList.scrollTop =
          this.mailList.scrollHeight - this.beforeLoadNextPageScrollHeight + this.beforeLoadNextPageScrollTop
      }
    } else if (this.mailList && this.lastMail) {
      this.scrolled = true
      this.mailList.scrollTop = this.lastMail.offsetTop
    }
  }

  render() {
    const {
      className,

      chainId,
      chainsEntities = {},

      mailsEntities = {},
      mailsApiActions = {},

      mailServiceActions = {},

      filesActions = {},

      modelsForCreateFormFromService = [],
      actionsForCreateFormFromService = {},
      createFormFromEntitiesActions = {},
    } = this.props

    const chain = chainsEntities.getById(chainId)

    const mailsApiConfig = {
      filter: {
        chain: chainId,
      },
    }
    const mails = mailsEntities.getArray(mailsApiConfig)
    const mailsIsLoading = mailsEntities.getIsLoadingArray(mailsApiConfig)
    const mailsNextPage = mailsEntities.getNextPage(mailsApiConfig)

    const lastUnreadMail = mails.reduce((memo, curr, i) => (curr.isRead ? memo : i), 0)

    this.setChainRead(mails)

    return (
      <div className={classNames(style.root, className)}>
        <div className={style.chainHeader}>
          <div className={style.chainInfo}>
            <div className={style.chainSubject}>
              {chain.chainSubject}
            </div>
            <div className={style.chainContacts}>
              {chain.contacts.join(', ')}
            </div>
          </div>
          <div className={style.dotMenuWrapper}>
            {!!this.state.attaches &&
              <div className={style.attachesCount}>
                {this.state.attaches}
              </div>
            }
            <DotMenu {...{
              className: style.dotMenu,
              size: 20,
            }}>
              {modelsForCreateFormFromService.map(item => {
                const model = this.state[item.modelName]
                if (model) {
                  return (
                    <EntityPageLink {...{
                      key: item.modelName,
                      className: style.entityLink,
                      model,
                    }}>
                      <TIcon {...{
                        className: style.dotMenuItem,
                        type: ICONS_TYPES.attachment,
                        size: 15,
                        label: item.modelTitle,
                      }} />
                    </EntityPageLink>
                  )
                }
                return null
              })}
              <TIcon {...{
                className: style.dotMenuItem,
                type: ICONS_TYPES.folder,
                size: 15,
                label: intlObject.intl.formatMessage(messages.moveToFolder),
                onClick: () => mailServiceActions.moveChains(chainId),
              }} />
            </DotMenu>
          </div>
        </div>
        <div {...{
          className: style.mailsListWrapper,
          ref: node => {
            this.mailList = node
          },
        }}>
          <AsyncEntitiesList {...{
            type: LIST_TYPES.loadMoreButton,
            className: style.mailsList,
            reverse: true,
            nextPage: mailsNextPage,
            isLoading: mailsIsLoading,
            nextPageAction: () => {
              if (this.mailList) {
                this.beforeLoadNextPageScrollHeight = this.mailList.scrollHeight
                this.beforeLoadNextPageScrollTop = this.mailList.scrollTop
              }
              mailsApiActions.loadNextPage(mailsApiConfig)
            },
          }} >
            {mails.map((model, i) => (
              <div {...{
                key: model.id,
                className: style.mailWrapper,
                ref: node => {
                  if (i === lastUnreadMail) this.lastMail = node
                },
              }}>
                <Mail {...{
                  open: i === 0 || !model.isRead,
                  model,
                  mailServiceActions,
                  filesActions,

                  onMailAttach: this.getAttachedEntity,
                  modelsForCreateFormFromService,
                  actionsForCreateFormFromService,
                  createFormFromEntitiesActions,
                }} />
              </div>
            ))}
          </AsyncEntitiesList>
        </div>
      </div>
    )
  }
}

export default MailsList
