import React, { PureComponent } from 'react'
import classNames from 'classnames'
import debounce from 'lodash/debounce'

import style from './index.css'

import AsyncEntitiesList from '$trood/components/AsyncEntitiesList'
import DotMenu from '$trood/components/DotMenu'
import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'

import Mail from '../Mail'


const SET_READ_TIMEOUT = 3000

class MailsList extends PureComponent {
  constructor(props) {
    super(props)
    this.scrolled = false
    this.beforeLoadNextPageScrollHeight = 0
    this.beforeLoadNextPageScrollTop = 0
    this.setChainRead = debounce(this.setChainRead.bind(this), SET_READ_TIMEOUT)
    this.scrollToMail = this.scrollToMail.bind(this)
  }

  componentDidMount() {
    this.scrollToMail()
  }

  componentDidUpdate(prevProps) {
    if (this.props.chainId !== prevProps.chainId) {
      this.setChainRead.cancel()
      this.scrolled = false
    }
    this.scrollToMail()
  }

  componentWillUnmount() {
    this.setChainRead.cancel()
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
          <DotMenu {...{
            className: style.dotMenu,
            size: 20,
          }}>
            <TIcon {...{
              className: style.dotMenuItem,
              type: ICONS_TYPES.folder,
              size: 15,
              label: 'В папку',
              onClick: () => mailServiceActions.moveChains(chainId),
            }} />
          </DotMenu>
        </div>
        <div {...{
          className: style.mailsListWrapper,
          ref: node => {
            this.mailList = node
          },
        }}>
          <AsyncEntitiesList {...{
            className: style.mailsList,
            reverse: true,
            nextPage: mailsNextPage,
            isLoading: mailsIsLoading,
            nextPageAction: () => {
              this.beforeLoadNextPageScrollHeight = this.mailList.scrollHeight
              this.beforeLoadNextPageScrollTop = this.mailList.scrollTop
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
