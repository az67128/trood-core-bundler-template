import React from 'react'
import basePageLayout from '$trood/styles/basePageLayout.css'
import { RESTIFY_CONFIG } from 'redux-restify'
import Header from '$trood/componentLibraries/TroodCoreComponents/internal/components/Header'
import Filters from '$trood/componentLibraries/TroodCoreComponents/internal/components/Filters'
import Table from './Table'
import PropTypes from 'prop-types'

const TableView = ({
  tableEntities,
  tableApiActions,
  tableEditorActions = {},
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
  const config = RESTIFY_CONFIG.registeredModels[tableEntities.modelType]
  return (
    <div className={basePageLayout.block}>
      <Header
        {...{
          title,
          entities: tableEntities,
          addNew,
          editorActions: tableEditorActions,
          form,
          formActions,
          filters,
          search,
        }}
      />
      <Filters {...{ filters, config, form, formActions, entities: tableEntities, ...restProps }} />
      <Table
        {...{
          config,
          tableEntities,
          tableApiActions,
          tableEditorActions,
          checking,
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

TableView.propTypes = {
  checking: PropTypes.bool,
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
export default TableView
