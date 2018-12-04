import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import TButton, { BUTTON_SPECIAL_TYPES, BUTTON_COLORS } from '$trood/components/TButton'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'

import { getNestedObjectField } from '$trood/helpers/nestedObjects'

class FoldersSettingsMailService extends PureComponent {
  static propTypes = {
    className: PropTypes.string,

    folders: PropTypes.arrayOf(PropTypes.object),
    foldersApiActions: PropTypes.object,
    editFolderFormActions: PropTypes.object,
    editFolderFormErrors: PropTypes.object,
    editFolderFormValid: PropTypes.bool,

    mailServiceActions: PropTypes.object,
  }

  static defaultProps = {
    className: '',

    folders: [],
    foldersApiActions: {},
    editFolderFormActions: {},

    mailServiceActions: {},
  }

  render() {
    const {
      className,

      folders,
      editFolderForm,
      foldersApiActions,
      editFolderFormActions,
      editFolderFormErrors,
      editFolderFormValid,

      mailServiceActions,
    } = this.props

    return (
      <div {...{
        className: classNames(style.root, className),
      }} >
        {!editFolderForm && folders.map(folder => (
          <div {...{
            key: folder.id,
            className: style.folder,
          }}>
            <div {...{
              className: style.folderName,
              onClick: () => {
                mailServiceActions.createFoldersForm(folder.id)
              },
            }}>
              {folder.name}
            </div>
            <TIcon {...{
              className: style.delete,
              type: ICONS_TYPES.trashBin,
              size: 16,
              onClick: () => foldersApiActions.deleteById(folder.id),
            }} />
          </div>
        ))}
        {!editFolderForm &&
          <TButton {...{
            className: style.buttonAdd,
            onClick: () => {
              mailServiceActions.createFoldersForm()
            },
            label: 'Папка',
            specialType: BUTTON_SPECIAL_TYPES.add,
          }} />
        }
        {editFolderForm &&
          <div {...{
            className: style.foldersAdd,
          }} >
            <TInput {...{
              className: style.input,
              label: 'Название папки',
              defaultValue: getNestedObjectField(editFolderForm, 'name'),
              replaceValue: getNestedObjectField(editFolderForm, 'name'),
              onChange: value => editFolderFormActions.changeField('name', value),
              onInvalid: errs => editFolderFormActions.setFieldError('name', errs),
              onValid: () => editFolderFormActions.resetFieldError('name'),
              errors: getNestedObjectField(editFolderFormErrors, 'name'),
              validate: {
                required: true,
                checkOnBlur: true,
              },
              type: INPUT_TYPES.text,
            }} />
            <div {...{
              className: style.buttonWrap,
            }} >
              <TButton {...{
                className: style.buttonAdd,
                onClick: editFolderFormActions.submit,
                label: editFolderForm.id ? 'Изменить' : 'Добавить',
                disabled: !editFolderFormValid,
              }} />
              <TButton {...{
                className: style.buttonCancel,
                label: 'Отменить',
                color: BUTTON_COLORS.gray,
                onClick: editFolderFormActions.deleteForm,
              }} />
            </div>
          </div>
        }
      </div>
    )
  }
}

export default FoldersSettingsMailService
