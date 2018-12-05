import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'
import modalsStyle from '$trood/styles/modals.css'

import { TFileInput, FileBrickView } from '$trood/files'

import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import TButton, { BUTTON_SPECIAL_TYPES } from '$trood/components/TButton'
import TSelect from '$trood/components/TSelect'
import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'
import HideableContent from '$trood/components/HideableContent'

import { getNestedObjectField } from '$trood/helpers/nestedObjects'


class ModalEditMail extends PureComponent {
  static propTypes = {
    className: PropTypes.string,

    model: PropTypes.object,
    modelErrors: PropTypes.object,
    modelValid: PropTypes.bool,

    mailboxes: PropTypes.arrayOf(PropTypes.object),

    startingToAddress: PropTypes.string,

    submitAction: PropTypes.func,

    filesEntities: PropTypes.object,
    filesActions: PropTypes.object,

    mailFormActions: PropTypes.object,
    mailServiceActions: PropTypes.object,
  }

  static defaultProps = {
    className: '',

    filesEntities: {},
    filesActions: {},
    mailFormActions: {},
    mailServiceActions: {},
  }

  render() {
    const {
      className,

      model,
      modelErrors,
      modelValid,

      mailboxes,

      startingToAddress,

      filesEntities,
      filesActions,

      submitAction,

      mailFormActions,
      mailServiceActions,
    } = this.props

    const getFormChangeInputProps = (name) => ({
      className: modalsStyle.thinControl,
      labelClassName: modalsStyle.thinControlLabel,
      inputClassName: modalsStyle.thinControlControl,
      value: getNestedObjectField(model, name),
      onChange: value => mailFormActions.changeField(name, value),
      onInvalid: errs => mailFormActions.setFieldError(name, errs),
      onValid: () => mailFormActions.resetFieldError(name),
      errors: getNestedObjectField(modelErrors, name),
      showTextErrors: false,
      validate: {
        required: true,
        checkOnBlur: true,
      },
    })

    const getFormChangeSelectProps = (name) => ({
      className: modalsStyle.thinControl,
      labelClassName: modalsStyle.thinControlLabel,
      controlClassName: modalsStyle.thinControlControl,
      placeHolder: 'Не выбрано',
      replaceSelectValues: model[name] && [model[name]],
      onChange: values => mailFormActions.changeField(name, values[0]),
      onInvalid: errs => mailFormActions.setFieldError(name, errs),
      onValid: () => mailFormActions.resetFieldError(name),
      errors: getNestedObjectField(modelErrors, name),
      showTextErrors: false,
      validate: {
        required: true,
        checkOnBlur: true,
      },
    })

    const { attachments = [] } = model

    return (
      <div {...{
        className: classNames(style.root, className),
      }} >
        <div className={style.left}>
          <TSelect {...{
            label: 'Откуда',
            items: mailboxes.map(box => ({ value: box.id, label: `${box.name} (${box.email})` })),
            ...getFormChangeSelectProps('mailbox'),
          }} />
          <TInput {...{
            label: 'Кому',
            type: INPUT_TYPES.email,
            ...getFormChangeInputProps(['to', 0]),
          }}>
            <div className={style.copyButtons}>
              <TButton {...{
                tabIndex: -1,
                thin: true,
                className: style.copyButton,
                onClick: () => mailFormActions.insertToArray('to', ''),
                label: 'Копия',
                specialType: BUTTON_SPECIAL_TYPES.add,
              }} />
              <TButton {...{
                tabIndex: -1,
                thin: true,
                className: style.copyButton,
                onClick: () => mailFormActions.insertToArray('bcc', ''),
                label: 'Скрытая копия',
                specialType: BUTTON_SPECIAL_TYPES.add,
              }} />
            </div>
          </TInput>
          {(model.to || []).slice(1).map((address, index) => {
            const realIndex = index + 1
            return (
              <TInput {...{
                key: index,
                label: 'Копия',
                type: INPUT_TYPES.email,
                ...getFormChangeInputProps(['to', realIndex]),
              }} >
                <TButton {...{
                  tabIndex: -1,
                  thin: true,
                  className: style.copyButtons,
                  onClick: () => mailFormActions.removeFromArray('to', realIndex),
                  specialType: BUTTON_SPECIAL_TYPES.minus,
                }} />
              </TInput>
            )
          })}
          {(model.bcc || []).map((address, index) => (
            <TInput {...{
              key: index,
              label: 'Скрытая копия',
              type: INPUT_TYPES.email,
              ...getFormChangeInputProps(['bcc', index]),
            }} >
              <TButton {...{
                tabIndex: -1,
                thin: true,
                className: style.copyButtons,
                onClick: () => mailFormActions.removeFromArray('bcc', index),
                specialType: BUTTON_SPECIAL_TYPES.minus,
              }} />
            </TInput>
          ))}
          <TInput {...{
            label: 'Тема',
            ...getFormChangeInputProps('subject'),
          }} />
          <TInput {...{
            type: INPUT_TYPES.wysiwyg,
            ...getFormChangeInputProps('body'),
            className: style.wysiwygWrapper,
            inputClassName: style.wysiwyg,
            placeholder: 'Текст письма...',
            validate: {
              required: false,
              checkOnBlur: true,
            },
          }} />
          {model.attachedMail &&
            <HideableContent {...{
              title: 'Прикрепленное письмо',
              className: style.attachedMail,
            }}>
              <div {...{
                dangerouslySetInnerHTML: {
                  __html: model.attachedMail,
                },
              }} />
            </HideableContent>
          }
        </div>
        <div className={style.right}>
          <div className={style.filesArea}>
            <TFileInput {...{
              className: classNames(style.fileInput, !attachments.length && style.fileInputFull),
              label: (
                <TIcon {...{
                  className: style.fileInputLabel,
                  size: 24,
                  type: ICONS_TYPES.plus,
                }} />
              ),
              onChange: files => {
                if (files.length) {
                  filesActions.uploadFile(files[0]).then(({ data }) => {
                    mailFormActions.changeField('attachments', attachments.concat(data.id))
                  })
                }
              },
            }} />
            {attachments.map(file => {
              const fileModel = filesEntities.getById(file.id || file)
              return (
                <FileBrickView {...{
                  key: fileModel.id,
                  model: fileModel,
                  className: style.file,
                }} />
              )
            })}
          </div>
          <TButton {...{
            label: 'Отправить',
            disabled: !modelValid,
            onClick: () => submitAction(mailServiceActions.sendMail(startingToAddress)),
          }} />
        </div>
      </div>
    )
  }
}

export default ModalEditMail
