import React from 'react'
import basePageLayout from '$trood/styles/basePageLayout.css'
import { RESTIFY_CONFIG } from 'redux-restify'
import Header from '$trood/componentLibraries/TroodCoreComponents/internal/components/Header'
import Filters from '$trood/componentLibraries/TroodCoreComponents/internal/components/Filters'
import List from './List'
import PropTypes from 'prop-types'

const ListView = ({
  listEntities,
  listApiActions,
  listEditorActions = {},
  checking = false,
  editable = false,
  include = [],
  exclude = [],
  form = {},
  formActions,
  filters = [],
  search,
  query,
  title,
  addNew,
  hideView,
  ...restProps
}) => {
  const config = RESTIFY_CONFIG.registeredModels[listEntities.modelType]
  return (
    <div className={basePageLayout.block}>
      <Header
        {...{
          title,
          entities: listEntities,
          addNew,
          editorActions: listEditorActions,
          form,
          formActions,
          filters,
          search,
        }}
      />
      <Filters {...{ filters, config, form, formActions, entities: listEntities, ...restProps }} />
      <List
        {...{
          config,
          listEntities,
          listApiActions,
          listEditorActions,
          editable,
          include,
          exclude,
          form,
          formActions,
          filters,
          search,
          query,
          hideView,
          ...restProps,
        }}
      />
    </div>
  )
}

ListView.propTypes = {
  editable: PropTypes.bool,
  include: PropTypes.arrayOf(PropTypes.string),
  exclude: PropTypes.arrayOf(PropTypes.string),
  filters: PropTypes.arrayOf(PropTypes.string),
  search: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)]),
  query: PropTypes.string,
  title: PropTypes.string,
  addNew: PropTypes.bool,
  hideView: PropTypes.bool,
}
export default ListView
